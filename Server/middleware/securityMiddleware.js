import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

// Comprehensive input validation and sanitization middleware
export const securityMiddleware = {
    // Sanitize all input types (body, params, query)
    sanitizeInputs: (req, res, next) => {
        try {
            if (req.body) {
                req.body = mongoSanitize.sanitize(req.body);
            }
            if (req.params) {
                req.params = mongoSanitize.sanitize(req.params);
            }
            if (req.query) {
                req.query = mongoSanitize.sanitize(req.query);
            }
            next();
        } catch (error) {
            console.error('Sanitization error:', error);
            return res.status(400).json({
                error: 'Invalid input detected',
                message: 'Request contains potentially malicious content'
            });
        }
    },

    // XSS protection for all input vectors
    xssProtection: (req, res, next) => {
        try {
            // Apply XSS protection to body, params, and query
            xss()(
                { body: req.body, params: req.params, query: req.query },
                res,
                next
            );
        } catch (error) {
            console.error('XSS protection error:', error);
            return res.status(400).json({
                error: 'XSS protection failed',
                message: 'Request contains potentially dangerous content'
            });
        }
    },

    // Query parameter validation helpers
    validateQueryParams: {
        // String parameter validation
        string: (value, maxLength = 100, fieldName = 'parameter') => {
            if (value && typeof value !== 'string') {
                throw new Error(`Invalid ${fieldName} type`);
            }
            if (value && value.length > maxLength) {
                throw new Error(`${fieldName} too long (max ${maxLength} characters)`);
            }
            return true;
        },

        // Numeric parameter validation
        number: (value, min = 1, max = 1000, fieldName = 'parameter') => {
            const num = parseInt(value);
            if (isNaN(num) || num < min || num > max) {
                throw new Error(`Invalid ${fieldName} (must be ${min}-${max})`);
            }
            return num;
        },

        // Email validation
        email: (value, fieldName = 'email') => {
            if (value && typeof value !== 'string') {
                throw new Error(`Invalid ${fieldName} type`);
            }
            if (value && value.length > 254) {
                throw new Error(`${fieldName} too long`);
            }
            if (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    throw new Error(`Invalid ${fieldName} format`);
                }
            }
            return true;
        },

        // Enum validation
        enum: (value, allowedValues, fieldName = 'parameter') => {
            if (value && !allowedValues.includes(value)) {
                throw new Error(`Invalid ${fieldName} specified`);
            }
            return true;
        }
    },

    // Rate limiting configuration
    rateLimitConfig: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 300, // limit each IP to 300 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            error: 'Too many requests from this IP',
            message: 'Please try again later'
        }
    },

    // Security headers middleware
    securityHeaders: (req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        next();
    }
};
