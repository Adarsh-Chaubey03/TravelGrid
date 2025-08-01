const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,   
} = require('../controller/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUserProfile);
router.put('/me/update', authMiddleware, updateUserProfile);
router.put('/me/password', authMiddleware, changePassword);
router.delete('/me/delete', authMiddleware, deleteUserAccount);

module.exports = router;
