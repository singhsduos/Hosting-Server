const indexPage =
  ('/',
  (req, res, next) => {
    res.redirect('/');
  });

const invalidPath =
  ('*',
  (req, res, next) => {
    res.redirect('/auth/login');
  });

const error = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};

module.exports = { indexPage, invalidPath, error };
