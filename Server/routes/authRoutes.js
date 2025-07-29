const express = require('express');
const router = express.Router();
const { loginUser, registerUser , logOutUser } = require('../controller/authController');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout' , logOutUser);

module.exports = router;
