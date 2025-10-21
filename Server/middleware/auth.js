import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET not set in environment variables');
  process.exit(1);
}

// Main auth middleware
export const verifyJWT = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const user = await getUser(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
    }

    // Attach user and auth info to request
    req.user = {
      id: user._id,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };

    next();
  } catch (error) {
    handleAuthError(error, res);
  }
};

// Role-based access control middleware
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    next();
  };
};

// Require email verification middleware
export const requireEmailVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required',
      isVerificationError: true
    });
  }
  next();
};

// Helper function to extract token from request
const getTokenFromRequest = (req) => {
  // Check cookie first
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  // Then check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.status = 401;
      error.message = 'Token expired';
    } else {
      error.status = 401;
      error.message = 'Invalid token';
    }
    throw error;
  }
};

// Helper function to get user from database
const getUser = async (userId) => {
  try {
    return await User.findById(userId).select('-password');
  } catch (error) {
    error.status = 500;
    error.message = 'Database error';
    throw error;
  }
};

// Helper function to handle auth errors
const handleAuthError = (error, res) => {
  const status = error.status || 500;
  const message = error.message || 'Authentication failed';

  return res.status(status).json({
    success: false,
    error: message
  });
};

