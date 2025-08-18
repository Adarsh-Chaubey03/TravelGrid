const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_development_only_change_in_production';

console.log('Auth middleware: JWT_SECRET is', JWT_SECRET ? 'set' : 'using fallback');

exports.verifyJWT = async (req, res, next) => {
  try {
    console.log('Auth middleware: verifyJWT called for path:', req.path);

    // Get token from cookies or Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    console.log('Auth middleware: Token found:', token ? 'Yes' : 'No');
    console.log('Auth middleware: Token from cookies:', req.cookies?.token ? 'Yes' : 'No');
    console.log('Auth middleware: Token from Authorization header:', req.headers.authorization ? 'Yes' : 'No');

    // If token not found
    if (!token) {
      console.log('Auth middleware: No token found, returning 401');
      return res.status(401).json({ message: "Authentication token missing", success: false });
    }

    // Verify token
    console.log('Auth middleware: Attempting to verify token with JWT_SECRET');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Auth middleware: Token verified successfully, decoded:', { id: decoded?.id });

    if (!decoded?.id) {
      console.log('Auth middleware: Token decoded but no id found, returning 403');
      return res.status(403).json({ message: "Invalid token", success: false });
    }

    // Get full user from DB and attach to req.user
    console.log('Auth middleware: Looking up user with ID:', decoded.id);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log('Auth middleware: User not found in database, returning 404');
      return res.status(404).json({ message: "User not found", success: false });
    }

    console.log('Auth middleware: User found, setting req.user and calling next()');
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware: Error during token verification:', error);
    const message =
      error.name === "TokenExpiredError"
        ? "Token expired"
        : error.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Token verification failed";

    return res.status(401).json({ message, success: false });
  }
};

// Export protect middleware (alias for verifyJWT)
exports.protect = exports.verifyJWT;
