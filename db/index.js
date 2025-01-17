const DatabaseFactory = require('./DatabaseFactory');
const dbConfig = require('../config/database');
const logger = require('../helpers/logger');

/** @type {import('./interfaces/Database')} */
let database = null;

/**
 * Initialize database connection
 * @async
 * @returns {Promise<import('./interfaces/Database')>} Database instance
 * @throws {Error} Database initialization error
 */
const initializeDatabase = async () => {
  try {
    if (!database) {
      const config = dbConfig[dbConfig.activeDb];
      database = DatabaseFactory.createDatabase(dbConfig.activeDb, config);
      await database.connect();
    }
    return database;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

/**
 * Get database instance
 * @returns {import('./interfaces/Database')} Database instance
 * @throws {Error} If database is not initialized
 */
const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return database;
};

/**
 * Close database connection
 * @async
 * @returns {Promise<void>}
 */
const closeDatabase = async () => {
  if (database) {
    await database.disconnect();
    database = null;
  }
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
};
