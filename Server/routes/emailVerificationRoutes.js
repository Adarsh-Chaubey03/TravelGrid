import express from 'express'

const router = express.Router();
import { checkVerificationStatus, resendVerificationCode, sendVerificationEmail, verifyEmailWithCode } from '../controller/emailVerificationController.js'

// Send verification email
router.post('/send-verification', sendVerificationEmail);

// Verify email with code
router.post('/verify-code', verifyEmailWithCode);

// Resend verification code
router.post('/resend-code', resendVerificationCode);

// Check verification status
router.get('/status', checkVerificationStatus);

export default router
