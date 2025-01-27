const config = require('../config/config.js');

const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return [config.frontBaseUrl];
  }
  return [config.frontBaseUrl];
};

const isOriginAllowed = (origin) => {
  const allowedOrigins = getAllowedOrigins();
  return !origin || allowedOrigins.includes(origin);
};

const accessHeaderMiddleware = (req, res, next) => {
  const origin = req.get('origin');

  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  next();
};

module.exports = {
  accessHeaderMiddleware,
  getAllowedOrigins,
};
