/**
 * Security Middleware for RentCars API
 * Provides authentication, rate limiting, and input validation
 */

const jwt = require('jsonwebtoken');

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'rentcars_secret_key_2024';

/**
 * Rate Limiting Implementation
 * Simple in-memory rate limiter
 */
const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // Max requests per window
        message = 'Too many requests, please try again later.'
    } = options;

    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!rateLimitStore.has(key)) {
            rateLimitStore.set(key, { count: 1, startTime: now });
            return next();
        }

        const record = rateLimitStore.get(key);
        
        if (now - record.startTime > windowMs) {
            rateLimitStore.set(key, { count: 1, startTime: now });
            return next();
        }

        if (record.count >= max) {
            return res.status(429).json({ 
                error: message,
                retryAfter: Math.ceil((record.startTime + windowMs - now) / 1000)
            });
        }

        record.count++;
        next();
    };
};

/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.',
                code: 'NO_TOKEN'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired. Please login again.',
                code: 'TOKEN_EXPIRED'
            });
        }
        return res.status(403).json({ 
            error: 'Invalid token.',
            code: 'INVALID_TOKEN'
        });
    }
};

/**
 * Admin Authorization Middleware
 * Ensures user has admin role
 */
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Access denied. Admin privileges required.',
            code: 'ADMIN_REQUIRED'
        });
    }
    next();
};

/**
 * Input Sanitization Middleware
 * Removes potentially dangerous characters
 */
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            // Remove potential XSS vectors
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = sanitize(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    if (req.params) {
        req.params = sanitize(req.params);
    }

    next();
};

/**
 * Request Logging Middleware
 * Logs all incoming requests for monitoring
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    
    next();
};

/**
 * CORS Configuration Middleware
 * Enhanced CORS settings
 */
const corsConfig = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5000',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

/**
 * Error Handler Middleware
 * Centralized error handling
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ 
            error: 'Validation failed',
            details: errors 
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ 
            error: 'Duplicate entry',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            error: 'Invalid ID format'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
};

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            username: user.username,
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName] || req.body[paramName] || req.body._id;
        
        if (!id) {
            return next();
        }

        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(id)) {
            return res.status(400).json({ 
                error: `Invalid ${paramName} format`
            });
        }
        
        next();
    };
};

module.exports = {
    rateLimit,
    authenticate,
    authorizeAdmin,
    sanitizeInput,
    requestLogger,
    corsConfig,
    errorHandler,
    generateToken,
    validateObjectId,
    JWT_SECRET
};
