/**
 * Field type enumeration
 * @enum {string}
 */
const FieldType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  OBJECT: 'object',
  ARRAY: 'array',
  REFERENCE: 'reference'
};

/**
 * Field definition interface
 * @typedef {Object} FieldDefinition
 * @property {FieldType} type - Field type
 * @property {boolean} [required] - Whether field is required
 * @property {*} [default] - Default value
 * @property {boolean} [unique] - Whether field should be unique
 * @property {string} [ref] - Referenced model name (for REFERENCE type)
 * @property {Object} [validate] - Validation rules
 */

/**
 * Schema definition interface
 * @interface
 */
class Schema {
  /**
   * Get MongoDB schema
   * @returns {Object} MongoDB schema definition
   */
  toMongoSchema() {
    throw new Error('Method not implemented');
  }

  /**
   * Get PostgreSQL schema
   * @returns {string} PostgreSQL schema SQL
   */
  toPostgresSchema() {
    throw new Error('Method not implemented');
  }

  /**
   * Get model name
   * @returns {string} Model name
   */
  getModelName() {
    throw new Error('Method not implemented');
  }

  /**
   * Get table name
   * @returns {string} Table name
   */
  getTableName() {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  Schema,
  FieldType
};
