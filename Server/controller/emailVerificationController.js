const User = require('../models/user');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update user with verification code
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    // Send email
    const subject = 'Verify Your Email - TravelGrid';
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
            <h1>🌍 TravelGrid</h1>
            <h2>Verify Your Email Address</h2>
          </div>
          <div class="content">
            <h3>Hello ${user.name}!</h3>
            <p>Welcome to TravelGrid! To complete your registration and start exploring amazing destinations, please verify your email address.</p>
            <p>Your verification code is:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in <strong>5 minutes</strong>.</p>
            <p>If you didn't create an account with TravelGrid, please ignore this email.</p>
            <div style="text-align: center;">
              <a href="http://localhost:5173/verify-email?email=${encodeURIComponent(email)}" class="button">Verify Email</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 TravelGrid. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    });

  } catch (error) {
    console.error('Send verification email error:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

// Verify email with code
const verifyEmailWithCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Check if code exists and is valid
    if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if code has expired
    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Return updated user data
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      picture: user.picture
    };

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update user with new verification code
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    // Send email
    const subject = 'New Verification Code - TravelGrid';
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
          .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌍 TravelGrid</h1>
            <h2>New Verification Code</h2>
          </div>
          <div class="content">
            <h3>Hello ${user.name}!</h3>
            <p>You requested a new verification code. Here's your new code:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in <strong>5 minutes</strong>.</p>
          </div>
          <div class="footer">
            <p>© 2025 TravelGrid. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Resend verification code error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
};

// Check verification status
const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Input validation and sanitization for query parameters
    if (typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email parameter type' });
    }

    // Length validation to prevent injection attacks
    if (email.length > 254) { // RFC 5321 maximum email length
      return res.status(400).json({ error: 'Email parameter too long' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      isVerified: user.isEmailVerified || false
    });

  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({ error: 'Failed to check verification status' });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmailWithCode,
  resendVerificationCode,
  checkVerificationStatus
};
