import  {User} from '../models/user.js'
import {sendEmail} from '../utils/emailService.js'
import crypto from 'crypto'
import { asyncHandler } from '../utils/asyncHandler.js'

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: 'Email is already verified' });
  }

  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.emailVerificationCode = verificationCode;
  user.emailVerificationExpires = expiresAt;
  await user.save();

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
});

// Verify email with code
export const verifyEmailWithCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: 'Email is already verified' });
  }

  if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
    return res.status(400).json({ error: 'Verification code has expired' });
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

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
});

// Resend verification code
export const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: 'Email is already verified' });
  }

  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.emailVerificationCode = verificationCode;
  user.emailVerificationExpires = expiresAt;
  await user.save();

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
});

// Check verification status
export const checkVerificationStatus = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email parameter type' });
  }

  if (email.length > 254) {
    return res.status(400).json({ error: 'Email parameter too long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    success: true,
    isVerified: user.isEmailVerified || false
  });
});
