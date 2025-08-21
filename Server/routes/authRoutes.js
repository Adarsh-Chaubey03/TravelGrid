const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  getCurrentUser, // /me route handler
} = require('../controller/authController');
const { verifyJWT } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/google', googleAuth);
// @access  Private (protected route)
router.get('/me', verifyJWT, getCurrentUser);

module.exports = router;
