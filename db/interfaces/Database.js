/**
 * Abstract Database Interface
 * @interface Database
 */
class Database {
  /**
   * Connect to the database
   * @abstract
   * @returns {Promise<void>}
   * @throws {Error} When method is not implemented
   */
  async connect() {
    throw new Error('Method not implemented');
  }

  /**
   * Disconnect from the database
   * @abstract
   * @returns {Promise<void>}
   * @throws {Error} When method is not implemented
   */
  async disconnect() {
    throw new Error('Method not implemented');
  }

  /**
   * Execute a query
   * @abstract
   * @returns {Promise<any>}
   * @throws {Error} When method is not implemented
   */
  async query() {
    throw new Error('Method not implemented');
  }

  /**
   * Execute a transaction
   * @abstract
   * @returns {Promise<any>}
   * @throws {Error} When method is not implemented
   */
  async transaction() {
    throw new Error('Method not implemented');
  }
}

module.exports = Database;
