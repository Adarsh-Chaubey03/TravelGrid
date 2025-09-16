const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
if (!JWT_SECRET) {
  console.error('JWT_SECRET not set in environment variables');
  process.exit(1);
}

// Cookie helper
const setTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.sameSite = "None";
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  } else {
    cookieOptions.sameSite = false;
  }

  res.cookie("token", token, cookieOptions);
};

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Google Auth
export const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  );
  const googleUser = await response.json();

  if (!googleUser.email) {
    return res.status(400).json({ success: false, error: "Invalid Google token" });
  }

  let user = await User.findOne({ email: googleUser.email });

  if (!user) {
    user = await User.create({
      name: googleUser.name || "Google User",
      email: googleUser.email,
      picture: googleUser.picture,
      googleId: googleUser.sub,
      isGoogleUser: true,
    });
  } else if (!user.googleId) {
    user.googleId = googleUser.sub;
    user.isGoogleUser = true;
    user.picture = googleUser.picture;
    await user.save();
  }

  setTokenCookie(res, user._id);

  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isEmailVerified: user.isEmailVerified,
    }
  });
});

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  const strong = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false
  });
  if (!strong) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
    });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: expiresAt,
    isEmailVerified: false
  });

  try {
    await sendVerificationEmail(normalizedEmail, name, verificationCode);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
  }

  setTokenCookie(res, user._id);

  return res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email for verification code.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified
    }
  });
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  if (user.isGoogleUser) {
    return res.status(400).json({ success: false, error: 'Please login with Google' });
  }

  if (!user.isGoogleUser && !user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Please verify your email address before logging in',
      needsVerification: true
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  setTokenCookie(res, user._id);

  return res.status(200).json({
    success: true,
    token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isEmailVerified: user.isEmailVerified
    }
  });
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax"
    })
    .status(200)
    .json({
      message: "User logged out successfully!",
      success: true
    });
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  res.status(200).json({
    success: true,
    user,
  });
});
