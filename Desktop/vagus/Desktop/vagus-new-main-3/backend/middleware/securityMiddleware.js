const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// XSS Protection middleware
const xssProtection = (req, res, next) => {
  // Helper function to sanitize input
  const sanitizeValue = (value) => {
    if (typeof value === "string") {
      return value
        .replace(/[<>\"'&]/g, (match) => {
          const entities = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "&": "&amp;",
          };
          return entities[match];
        })
        .trim();
    }
    return value;
  };

  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (typeof obj === "object") {
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }

    return sanitizeValue(obj);
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000),
      });
    },
  });
};

// General rate limiter
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  1000, // limit each IP to 1000 requests per windowMs
  "Too many requests from this IP, please try again later.",
);

// Strict rate limiter for auth endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later.",
);

// Admin rate limiter
const adminLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  200, // limit each IP to 200 requests per windowMs
  "Too many admin requests, please try again later.",
);

// File upload rate limiter
const uploadLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20, // limit each IP to 20 uploads per windowMs
  "Too many file uploads, please try again later.",
);

// Content Security Policy
const cspMiddleware = (req, res, next) => {
  // Skip CSP for image routes to avoid conflicts
  if (req.path.includes('/image')) {
    return next();
  }
  
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob: https: http: *; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https: http:; " +
      "frame-ancestors 'none';",
  );
  next();
};

// Security headers
const securityHeaders = (req, res, next) => {
  // Skip restrictive headers for image routes
  if (req.path.includes('/image')) {
    // For image routes, only set minimal security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.removeHeader("X-Powered-By");
    return next();
  }

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS filtering
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Remove server information
  res.removeHeader("X-Powered-By");

  next();
};

// Input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

// SQL injection prevention
const sqlInjectionProtection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT( +INTO)?|MERGE|SELECT|UPDATE|UNION( +ALL)?)\b)/i,
    /(;|\-\-|\/\*|\*\/|xp_|sp_)/i,
    /'[^']*'[^,);\s]*[,);\s]/i,
  ];

  const checkForSQLInjection = (value) => {
    if (typeof value === "string") {
      return sqlPatterns.some((pattern) => pattern.test(value));
    }
    return false;
  };

  const checkObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
          if (checkObject(value)) return true;
        } else if (checkForSQLInjection(value)) {
          return true;
        }
      }
    }
    return false;
  };

  // Check body, query, and params
  if (
    checkObject(req.body) ||
    checkObject(req.query) ||
    checkObject(req.params)
  ) {
    return res.status(400).json({
      error: "Invalid input detected",
    });
  }

  next();
};

// Global CORS middleware for image routes
const imageCorsMiddleware = (req, res, next) => {
  // Check if this is an image route
  if (req.path.includes('/image')) {
    console.log(`🖼️ Global CORS middleware for ${req.method} ${req.path}`);
    console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
    console.log(`🔗 Referer: ${req.headers.referer || 'No referer'}`);
    
    // COMPREHENSIVE CORS headers for image responses
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400', // 24 hours
      'Cross-Origin-Embedder-Policy': 'unsafe-none', // Explicitly disable COEP
      'Cross-Origin-Resource-Policy': 'cross-origin', // Allow cross-origin resources
      'Cross-Origin-Opener-Policy': 'unsafe-none', // Allow cross-origin opener
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log(`✅ Preflight request handled for ${req.path}`);
      return res.status(200).end();
    }
  }
  
  next();
};

module.exports = {
  xssProtection,
  generalLimiter,
  authLimiter,
  adminLimiter,
  uploadLimiter,
  cspMiddleware,
  securityHeaders,
  validateInput,
  sqlInjectionProtection,
  imageCorsMiddleware,
};
