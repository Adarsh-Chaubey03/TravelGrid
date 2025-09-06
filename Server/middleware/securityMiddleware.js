import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import { AppError, ERROR_TYPES } from '../utils/errorHandler.js';

// Comprehensive input validation and sanitization middleware
const securityMiddleware = {
    // CSRF protection
    csrfProtection: csrf({
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        }
    }),

    // Rate limiting for different endpoints
    rateLimiter: {
        // General API rate limit
        api: rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later',
            standardHeaders: true,
            legacyHeaders: false
        }),

        // Stricter limit for auth endpoints
        auth: rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 5, // limit each IP to 5 requests per windowMs
            message: 'Too many authentication attempts, please try again later',
            standardHeaders: true,
            legacyHeaders: false
        })
    },

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
            throw new AppError('Invalid input detected', ERROR_TYPES.VALIDATION, 400);
        }
    },

    // XSS protection
    xssProtection: (req, res, next) => {
        try {
            xss()(req, res, next);
        } catch (error) {
            throw new AppError('Potentially dangerous content detected', ERROR_TYPES.VALIDATION, 400);
        }
    },

    // Security headers
    securityHeaders: (req, res, next) => {
        // CORS headers
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, CSRF-Token');
        
        // Security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
        res.setHeader('Referrer-Policy', 'same-origin');
        
        next();
    }
};

export default securityMiddleware;
