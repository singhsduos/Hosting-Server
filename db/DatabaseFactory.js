const MongoDatabase = require('./implementations/MongoDatabase');
const PostgresDatabase = require('./implementations/PostgresDatabase');

/**
 * Factory class for creating database instances
 * @class DatabaseFactory
 */
class DatabaseFactory {
  /**
   * Create a database instance based on type
   * @param {string} type - Type of database ('mongodb' or 'postgres')
   * @param {Object} config - Database configuration
   * @returns {Database} Database instance
   * @throws {Error} When database type is not supported
   */
  static createDatabase(type, config) {
    switch (type.toLowerCase()) {
    case 'mongodb':
      return new MongoDatabase(config);
    case 'postgres':
      return new PostgresDatabase(config);
    default:
      throw new Error(`Unsupported database type: ${type}`);
    }
  }
}

module.exports = DatabaseFactory;
