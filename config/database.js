const config = require('config');

/**
 * Database configuration
 */
const dbConfig = {
  // Active database type (mongodb or postgres)
  activeDb: process.env.DB_TYPE || config.get('DB.TYPE') || 'postgres',

  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || config.get('DB.MONGODB.URI'),
    options: config.get('DB.MONGODB.OPTIONS')
  },

  // PostgreSQL configuration
  postgres: {
    user: process.env.POSTGRES_USER || config.get('DB.POSTGRES.USER'),
    host: process.env.POSTGRES_HOST || config.get('DB.POSTGRES.HOST'),
    database: process.env.POSTGRES_DB || config.get('DB.POSTGRES.DATABASE'),
    password: process.env.POSTGRES_PASSWORD || config.get('DB.POSTGRES.PASSWORD'),
    port: parseInt(process.env.POSTGRES_PORT || config.get('DB.POSTGRES.PORT')),
    max: config.get('DB.POSTGRES.MAX'),
    idleTimeoutMillis: config.get('DB.POSTGRES.IDLE_TIMEOUT')
  }
};

module.exports = dbConfig;
