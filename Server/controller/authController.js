const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const mongoose = require('mongoose');
const { sendEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
if (!JWT_SECRET) {
  console.error('JWT_SECRET not set in environment variables');
  process.exit(1);
}

// Cookie helper
const setTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Set sameSite based on environment
  if (process.env.NODE_ENV === "production") {
    cookieOptions.sameSite = "None";
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  } else {
    // For development, don't set sameSite to allow cross-origin cookies
    cookieOptions.sameSite = false;
  }

  res.cookie("token", token, cookieOptions);
};

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Google Auth
exports.googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    const googleUser = await response.json();

    if (!googleUser.email) {
      return res.status(400).json({ success: false, error: "Invalid Google token" });
    }

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name || "Google User",
        email: googleUser.email,
        picture: googleUser.picture,
        googleId: googleUser.sub,
        isGoogleUser: true,
      });
    } else if (!user.googleId) {
      user.googleId = googleUser.sub;
      user.isGoogleUser = true;
      user.picture = googleUser.picture;
      await user.save();
    }

    setTokenCookie(res, user._id);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isEmailVerified: user.isEmailVerified,
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Enforce strong password policy
    const strong = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false
    });
    if (!strong) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code for new users
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: expiresAt,
      isEmailVerified: false
    });

    // Send verification email
    try {
      const subject = 'Welcome to TravelGrid - Verify Your Email';
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #ec4899, #f97316); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .code { font-size: 32px; font-weight: bold; color: #ec4899; text-align: center; letter-spacing: 5px; margin: 20px 0; padding: 15px; border: 2px dashed #ec4899; border-radius: 10px; background-color: #fdf2f8; }
            .button { display: inline-block; background: linear-gradient(135deg, #ec4899, #f97316); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Welcome to TravelGrid!</h1>
              <h2>Verify Your Email Address</h2>
            </div>
            <div class="content">
              <h3>Hello ${name}!</h3>
              <p>Thank you for joining TravelGrid! To complete your registration and start exploring amazing destinations, please verify your email address.</p>
              <p>Your verification code is:</p>
              <div class="code">${verificationCode}</div>
              <p>This code will expire in <strong>5 minutes</strong>.</p>
              <p>Enter this code on the verification page to activate your account.</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?email=${encodeURIComponent(normalizedEmail)}" class="button">Verify Email</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 TravelGrid. All rights reserved.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail(normalizedEmail, subject, html);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    setTokenCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ success: false, error: 'Please login with Google' });
    }

    // Optional: Check if email is verified for non-Google users
    if (!user.isGoogleUser && !user.isEmailVerified) {
      return res.status(403).json({ 
        success: false, 
        error: 'Please verify your email address before logging in',
        needsVerification: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    setTokenCookie(res, user._id);

    return res.status(200).json({
      success: true,
      token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Logout User
exports.logoutUser = async (req, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax"
      })
      .status(200)
      .json({
        message: "User logged out successfully!",
        success: true
      });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out the user!",
      success: false
    });
  }
};

// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
