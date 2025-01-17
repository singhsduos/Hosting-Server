/**
 * Base Model interface
 * @interface
 */
class Model {
  /**
   * Create a new document
   * @async
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    throw new Error('Method not implemented');
  }

  /**
   * Find documents
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} Found documents
   */
  async find(filter) {
    throw new Error('Method not implemented');
  }

  /**
   * Find one document
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object>} Found document
   */
  async findOne(filter) {
    throw new Error('Method not implemented');
  }

  /**
   * Update documents
   * @async
   * @param {Object} filter - Filter criteria
   * @param {Object} update - Update data
   * @returns {Promise<Object>} Update result
   */
  async update(filter, update) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete documents
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object>} Delete result
   */
  async delete(filter) {
    throw new Error('Method not implemented');
  }
}

module.exports = Model;
