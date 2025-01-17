/**
 * Database configuration
 * @type {Object}
 */
module.exports = {
  /** @type {string} Active database type */
  activeDb: process.env.DB_TYPE || 'postgres',

  /** @type {Object} MongoDB configuration */
  mongodb: {
    /** @type {string} MongoDB connection URI */
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database',
  },

  /** @type {Object} PostgreSQL configuration */
  postgres: {
    /** @type {string} PostgreSQL user */
    user: process.env.POSTGRES_USER || 'postgres',
    /** @type {string} PostgreSQL host */
    host: process.env.POSTGRES_HOST || 'localhost',
    /** @type {string} PostgreSQL database name */
    database: process.env.POSTGRES_DB || 'your_database',
    /** @type {string} PostgreSQL password */
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    /** @type {number} PostgreSQL port */
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  },
};
