// XSS Protection utilities for frontend

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
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
};

/**
 * Sanitize HTML content for safe display
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (typeof html !== "string") return html;

  // Remove script tags and their content
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove event handlers
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove javascript: URLs
  html = html.replace(/javascript:/gi, "");

  // Remove data: URLs (except images)
  html = html.replace(/data:(?!image\/)[^;]*;/gi, "");

  return html;
};

/**
 * Validate file upload to prevent malicious files
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  } = options;

  const result = {
    isValid: true,
    errors: [],
  };

  if (!file) {
    result.isValid = false;
    result.errors.push("No file selected");
    return result;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    result.isValid = false;
    result.errors.push(
      `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    );
  }

  // Check file size
  if (file.size > maxSize) {
    result.isValid = false;
    result.errors.push(
      `File size too large. Maximum size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
    );
  }

  // Check file extension
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));
  if (!allowedExtensions.includes(fileExtension)) {
    result.isValid = false;
    result.errors.push(
      `Invalid file extension. Allowed extensions: ${allowedExtensions.join(", ")}`,
    );
  }

  // Check for double extensions (e.g., file.jpg.exe)
  const extensionCount = (file.name.match(/\./g) || []).length;
  if (extensionCount > 1) {
    result.isValid = false;
    result.errors.push("Files with multiple extensions are not allowed");
  }

  return result;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with strength score
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 0,
    errors: [],
  };

  if (!password) {
    result.errors.push("Password is required");
    return result;
  }

  if (password.length < 6) {
    result.errors.push("Password must be at least 6 characters long");
  } else {
    result.strength += 1;
  }

  if (password.length >= 8) {
    result.strength += 1;
  }

  if (/[a-z]/.test(password)) {
    result.strength += 1;
  }

  if (/[A-Z]/.test(password)) {
    result.strength += 1;
  }

  if (/[0-9]/.test(password)) {
    result.strength += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    result.strength += 1;
  }

  result.isValid = result.errors.length === 0;

  return result;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Clean object by removing potentially dangerous properties
 * @param {Object} obj - Object to clean
 * @returns {Object} - Cleaned object
 */
export const cleanObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const cleaned = {};
  const dangerousKeys = ["__proto__", "constructor", "prototype"];

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !dangerousKeys.includes(key)) {
      if (typeof obj[key] === "string") {
        cleaned[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        cleaned[key] = cleanObject(obj[key]);
      } else {
        cleaned[key] = obj[key];
      }
    }
  }

  return cleaned;
};

/**
 * Generate a secure random token
 * @param {number} length - Token length
 * @returns {string} - Random token
 */
export const generateSecureToken = (length = 32) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    token += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return token;
};

/**
 * Debounce function to prevent rapid API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  sanitizeInput,
  sanitizeHTML,
  validateFileUpload,
  validateEmail,
  validatePassword,
  validateURL,
  cleanObject,
  generateSecureToken,
  debounce,
  throttle,
};
