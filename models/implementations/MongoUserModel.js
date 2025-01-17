const mongoose = require('mongoose');
const Model = require('../interfaces/Model');

/**
 * MongoDB User model implementation
 * @class MongoUserModel
 * @extends {Model}
 */
class MongoUserModel extends Model {
  /**
   * Create MongoDB User model
   * @param {import('../schemas/UserSchema')} schema - User schema
   */
  constructor(schema) {
    super();
    this.schema = schema;
    this.model = mongoose.model(schema.getModelName(), schema.toMongoSchema());
  }

  /**
   * Create a new user
   * @async
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Find users
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} Found users
   */
  async find(filter) {
    return this.model.find(filter).exec();
  }

  /**
   * Find one user
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object>} Found user
   */
  async findOne(filter) {
    return this.model.findOne(filter).exec();
  }

  /**
   * Update users
   * @async
   * @param {Object} filter - Filter criteria
   * @param {Object} update - Update data
   * @returns {Promise<Object>} Update result
   */
  async update(filter, update) {
    return this.model.updateMany(filter, update).exec();
  }

  /**
   * Delete users
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object>} Delete result
   */
  async delete(filter) {
    return this.model.deleteMany(filter).exec();
  }
}

module.exports = MongoUserModel;
