require('dotenv').config();

module.exports = {
  development: {
    port: process.env.PORT || 3000,
    database: {
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/dev_db'
    }
  },
  production: {
    port: process.env.PORT || 3000,
    database: {
      url: process.env.DATABASE_URL
    }
  }
};
