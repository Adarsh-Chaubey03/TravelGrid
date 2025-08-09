const express = require('express');
const router = express.Router();
const {
  sendVerificationEmail,
  verifyEmailWithCode,
  resendVerificationCode,
  checkVerificationStatus
} = require('../controller/emailVerificationController');
const { verifyJWT } = require('../middleware/auth');

// Send verification email
router.post('/send-verification', sendVerificationEmail);

// Verify email with code
router.post('/verify-code', verifyEmailWithCode);

// Resend verification code
router.post('/resend-code', resendVerificationCode);

// Check verification status
router.get('/status', checkVerificationStatus);

module.exports = router;
