const config = require("../config/config.js")


/**
 * Get allowed origins based on environment
 * @returns {string[]} Array of allowed origins
 */
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return [
      config.frontBaseUrl
    ];
  }
  // For development, allow localhost origins
  return [config.frontBaseUrl];
};

/**
 * Check if origin is allowed
 * @param {string} origin - Request origin
 * @returns {boolean} Whether origin is allowed
 */
const isOriginAllowed = (origin) => {
  const allowedOrigins = getAllowedOrigins();
  return !origin || allowedOrigins.includes(origin);
};

/**
 * Middleware to handle CORS and access control headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const accessHeaderMiddleware = (req, res, next) => {
  const origin = req.get('origin');

  // Set CORS headers based on origin
  if (isOriginAllowed(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Allow specific headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  // Allow specific HTTP methods
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  next();
};

module.exports = {
  accessHeaderMiddleware,
  getAllowedOrigins
};
