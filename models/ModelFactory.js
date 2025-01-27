const dbConfig = require('../config/database');
const MongoUserModel = require('./implementations/MongoUserModel');
const PostgresUserModel = require('./implementations/PostgresUserModel');
const UserSchema = require('./schemas/UserSchema');

/**
 * Model factory class
 * @class ModelFactory
 */
class ModelFactory {
  /**
   * Create a model instance
   * @param {string} modelName - Name of the model
   * @returns {import('./interfaces/Model')} Model instance
   * @throws {Error} If model or database type is not supported
   */
  static createModel(modelName) {
    const dbType = dbConfig.activeDb;
    const schema = ModelFactory._createSchema(modelName);

    switch (modelName.toLowerCase()) {
      case 'user':
        return dbType === 'mongodb' ? new MongoUserModel(schema) : new PostgresUserModel(schema);
      default:
        throw new Error(`Unsupported model: ${modelName}`);
    }
  }

  /**
   * Create a schema instance
   * @private
   * @param {string} modelName - Name of the model
   * @returns {import('./interfaces/Schema').Schema} Schema instance
   * @throws {Error} If model is not supported
   */
  static _createSchema(modelName) {
    switch (modelName.toLowerCase()) {
      case 'user':
        return new UserSchema();
      default:
        throw new Error(`Unsupported model: ${modelName}`);
    }
  }
}

module.exports = ModelFactory;
