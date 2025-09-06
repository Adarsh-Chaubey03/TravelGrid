import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  getCurrentUser, // /me route handler
} from '../controller/authController.js';
import { verifyJWT } from '../middleware/auth.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/google', googleAuth);
// @access  Private (protected route)
router.get('/me', verifyJWT, getCurrentUser);

export default router;