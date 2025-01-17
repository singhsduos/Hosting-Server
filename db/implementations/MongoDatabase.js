const mongoose = require('mongoose');
const Database = require('../interfaces/Database');
const logger = require('../../helpers/logger');

/**
 * MongoDB database implementation
 * @class MongoDatabase
 * @extends {Database}
 */
class MongoDatabase extends Database {
  /**
   * Create MongoDB database instance
   * @param {Object} config - Database configuration
   * @param {string} config.uri - MongoDB connection URI
   */
  constructor(config) {
    super();
    this.config = config;
    this.connection = null;
  }

  /**
   * Connect to MongoDB database
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Connection error
   */
  async connect() {
    try {
      this.connection = await mongoose.connect(this.config.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('MongoDB Connected Successfully');
    } catch (error) {
      logger.error('MongoDB Connection Error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB database
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Disconnection error
   */
  async disconnect() {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB Disconnected Successfully');
    } catch (error) {
      logger.error('MongoDB Disconnection Error:', error);
      throw error;
    }
  }

  /**
   * Execute a query
   * @async
   * @param {mongoose.Model} model - Mongoose model
   * @param {string} operation - Query operation
   * @param {...*} args - Query arguments
   * @returns {Promise<any>} Query results
   * @throws {Error} Query error
   */
  async query(model, operation, ...args) {
    try {
      return await model[operation](...args);
    } catch (error) {
      logger.error(`MongoDB Query Error: ${operation}`, error);
      throw error;
    }
  }

  /**
   * Execute a transaction
   * @async
   * @param {Function} callback - Transaction callback
   * @returns {Promise<any>} Transaction result
   * @throws {Error} Transaction error
   */
  async transaction(callback) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = MongoDatabase;
