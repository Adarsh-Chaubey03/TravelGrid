// Error types enum
const ERROR_TYPES = {
  VALIDATION: 'ValidationError',
  AUTHENTICATION: 'AuthenticationError',
  AUTHORIZATION: 'AuthorizationError',
  NOT_FOUND: 'NotFoundError',
  RATE_LIMIT: 'RateLimitError',
  SERVER: 'ServerError'
};

class AppError extends Error {
  constructor(message, type = ERROR_TYPES.SERVER, statusCode = 500) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    type: err.type,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // If it's our custom error, use its status code
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.type,
        message: err.message
      }
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: {
        type: ERROR_TYPES.VALIDATION,
        message: 'Validation failed',
        details: errors
      }
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: {
        type: ERROR_TYPES.VALIDATION,
        message: `${field} already exists`
      }
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: {
      type: ERROR_TYPES.SERVER,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message
    }
  });
};

// Export as ES modules
export { AppError, ERROR_TYPES, handleError };
