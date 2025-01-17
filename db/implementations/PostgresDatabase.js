const { Pool } = require('pg');
const Database = require('../interfaces/Database');
const logger = require('../../helpers/logger');

/**
 * PostgreSQL database implementation
 * @class PostgresDatabase
 * @extends {Database}
 */
class PostgresDatabase extends Database {
  /**
   * Create PostgreSQL database instance
   * @param {Object} config - Database configuration
   * @param {string} config.user - Database user
   * @param {string} config.host - Database host
   * @param {string} config.database - Database name
   * @param {string} config.password - Database password
   * @param {number} config.port - Database port
   */
  constructor(config) {
    super();
    this.config = config;
    this.pool = new Pool({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: config.port,
    });
  }

  /**
   * Connect to PostgreSQL database
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Connection error
   */
  async connect() {
    try {
      await this.pool.connect();
      logger.info('PostgreSQL Connected Successfully');
    } catch (error) {
      logger.error('PostgreSQL Connection Error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from PostgreSQL database
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Disconnection error
   */
  async disconnect() {
    try {
      await this.pool.end();
      logger.info('PostgreSQL Disconnected Successfully');
    } catch (error) {
      logger.error('PostgreSQL Disconnection Error:', error);
      throw error;
    }
  }

  /**
   * Execute a query
   * @async
   * @param {string} queryText - SQL query text
   * @param {Array} [values=[]] - Query parameters
   * @returns {Promise<Array>} Query results
   * @throws {Error} Query error
   */
  async query(queryText, values = []) {
    try {
      const result = await this.pool.query(queryText, values);
      return result.rows;
    } catch (error) {
      logger.error('PostgreSQL Query Error:', error);
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
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = PostgresDatabase;
