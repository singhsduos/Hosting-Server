const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const checkAuth = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  jwt.verify(token, config.jsonSecret, (err, user) => {
    if (err) {
      return res.redirect('/auth/login');
    }
    req.user = user;
    next();
  });
};

module.exports = checkAuth;
