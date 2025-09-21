import {User} from '../models/user.js'
import crypto from 'crypto'
import { sendEmail } from '../utils/emailService.js'
import bcrypt from 'bcryptjs'
import { asyncHandler } from '../utils/asyncHandler.js'

export const resetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      msg: "All fields are required",
    });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({
      success: false,
      msg: "This email is not found",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  console.log("Token:", token);

  const tokenExpiry = process.env.TOKEN_EXPIRY || 5 * 60 * 1000;
  await User.findOneAndUpdate(
    { email: email },
    { token: token, resetPasswordExpires: Date.now() + tokenExpiry },
    { new: true }
  );

  const baseUrl = process.env.BASE_URL || "http://localhost:5173";
  const url = `${baseUrl}/update-password/${token}`;
  const emailTitle = "Password Reset Request";
  const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #ec4899, #f97316); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #ec4899, #f97316); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Password Reset</h1>
      <h2>TravelGrid Security</h2>
    </div>
    <div class="content">
      <h3>Hello ${user.name},</h3>
      <p>We received a request to reset your password for your <strong>TravelGrid</strong> account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center;">
        <a href="${url}" class="button">Reset Password</a>
      </div>
      <p>This link will expire in <strong>5 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email. Your account remains secure.</p>
    </div>
    <div class="footer">
      <p>© 2025 TravelGrid. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

  await sendEmail(email, emailTitle, emailBody);

  return res.status(200).json({
    success: true,
    msg: "Email sent successfully, Please check email and change password",
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword, token } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({
      msg: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      msg: "Password not matching",
    });
  }

  const userDetails = await User.findOne({ token: token });

  if (!userDetails) {
    return res.status(400).json({
      success: false,
      msg: "Token is invalid",
    });
  }

  const hashedPass = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { token: token },
    { password: hashedPass },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    msg: "Password Reset Successfully",
  });
});
