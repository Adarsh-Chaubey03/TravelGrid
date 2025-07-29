const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const validator = require('validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);  // Validate email format
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({
        success: false, message: 'Invalid email format'
      });
  }  // Validate email format
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({
        success: false, message: 'Invalid email format'
      });
  }
};
// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  // Validate email format
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({
        success: false, message: 'Invalid email format'
      });
  }

  // Validate password 
  if (!validator.isStrongPassword(password)) {
    return res
      .status(400)
      .json({
        success: false, message: 'Password is not strong enough'
      });
  }

  try {
    const normalizedemail = email.toLowerCase();
    // Check for existing user
    const userExists = await User.findOne({ email: normalizedemail });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = await User.create({
      name,
      email: normalizedemail,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: '✅ User registered',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  // Validate email format
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({
        success: false, message: 'Invalid email format'
      });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: '✅ Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
