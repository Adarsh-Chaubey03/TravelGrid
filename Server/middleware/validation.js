import Joi from 'joi';
import { AppError, ERROR_TYPES } from '../utils/errorHandler.js';

const validate = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate({
      body: req.body,
      query: req.query,
      params: req.params
    }, { abortEarly: false });

    if (validationResult.error) {
      const errors = validationResult.error.details.map(detail => detail.message);
      throw new AppError('Validation failed', ERROR_TYPES.VALIDATION, 400, errors);
    }

    // Replace request data with validated data
    req.body = validationResult.value.body;
    req.query = validationResult.value.query;
    req.params = validationResult.value.params;
    
    next();
  };
};

// Common validation schemas
const schemas = {
  auth: {
    register: Joi.object({
      body: Joi.object({
        name: Joi.string().trim().min(2).max(50).required()
          .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters'
          }),
        email: Joi.string().email().required()
          .messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required'
          }),
        password: Joi.string()
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
          .required()
          .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
            'string.empty': 'Password is required'
          })
      })
    }),
    login: Joi.object({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
    })
  },
  user: {
    update: Joi.object({
      body: Joi.object({
        name: Joi.string().trim().min(2).max(50),
        email: Joi.string().email(),
        picture: Joi.string().uri().allow(null, '')
      })
    })
  },
  booking: {
    create: Joi.object({
      body: Joi.object({
        tripDate: Joi.date().greater('now').required(),
        destination: Joi.string().required(),
        travelers: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required()
      })
    })
  }
};

export { validate, schemas };
