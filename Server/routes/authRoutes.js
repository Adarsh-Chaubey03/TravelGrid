import express from 'express'
import { getCurrentUser, googleAuth, loginUser, logoutUser, registerUser } from '../controller/authController.js'
import {verifyJWT} from '../middleware/auth.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/google', googleAuth);
// @access  Private (protected route)
router.get('/me', verifyJWT, getCurrentUser);

export default router
