import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.js';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET not set in environment variables');
  process.exit(1);
}

// Enhanced JWT token generation with user role
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { 
      id: userId,
      role,
      iat: Date.now(),
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Secure cookie settings
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Google OAuth authentication
export const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      success: false, 
      error: 'Google token is required' 
    });
  }

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to verify Google token');
    }

    const googleUser = await response.json();

    if (!googleUser.email || !googleUser.sub) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid Google token' 
      });
    }

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name || 'Google User',
        email: googleUser.email,
        picture: googleUser.picture,
        googleId: googleUser.sub,
        isGoogleUser: true,
        isEmailVerified: true
      });
    } else if (!user.googleId) {
      user.googleId = googleUser.sub;
      user.isGoogleUser = true;
      user.picture = googleUser.picture || user.picture;
      await user.save();
    }

    const authToken = generateToken(user._id, user.role);
    res.cookie('token', authToken, getCookieOptions());

    return res.status(200).json({
      success: true,
      token: authToken,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
});

// User registration
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required' 
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check existing user
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email is already registered' 
    });
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    emailVerificationToken: crypto.randomBytes(32).toString('hex'),
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  const authToken = generateToken(user._id, user.role);
  res.cookie('token', authToken, getCookieOptions());

  // TODO: Send verification email here

  return res.status(201).json({
    success: true,
    token: authToken,
    user: user.toPublicJSON(),
    message: 'Registration successful! Please verify your email.'
  });
});

// User login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  // Find user and include password for comparison
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials' 
    });
  }

  if (user.isGoogleUser) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please sign in with Google' 
    });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials' 
    });
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  const authToken = generateToken(user._id, user.role);
  res.cookie('token', authToken, getCookieOptions());

  return res.status(200).json({
    success: true,
    token: authToken,
    user: user.toPublicJSON()
  });
});

// User logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    ...getCookieOptions(),
    maxAge: 0
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      error: 'User not found' 
    });
  }

  return res.status(200).json({
    success: true,
    user: user.toPublicJSON()
  });
});

// Verify email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired verification token'
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});
