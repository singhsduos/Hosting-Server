const { Schema, FieldType } = require('../interfaces/Schema');
const mongoose = require('mongoose');

/**
 * Repo schema implementation
 * @class RepoSchema
 * @extends {Schema}
 */
class RepoSchema extends Schema {
  constructor() {
    super();
    this.definition = {
      userId: {
        type: FieldType.STRING,
        required: true
      },
      repoName: {
        type: FieldType.STRING,
        required: true,
        unique: true
      },
      branchName: {
        type: FieldType.STRING,
        required: true,
      },
      destinationPath: {
        type: FieldType.STRING,
        required: true,
      },
      cloneCount: {
        type: FieldType.NUMBER,
        default: 1,
      },
      lastCloned: {
        type: FieldType.DATE,
        default: Date.now,
      },
      createdAt: {
        type: FieldType.DATE,
        default: Date.now,
      },
      updatedAt: {
        type: FieldType.DATE,
        default: Date.now,
      },
    };
  }

  /**
   * Convert to MongoDB schema
   * @returns {mongoose.Schema} Mongoose schema
   */
  toMongoSchema() {
    const mongooseSchema = {};

    for (const [field, definition] of Object.entries(this.definition)) {
      const schemaField = {
        type: this._getMongooseType(definition.type),
        required: definition.required,
        default: definition.default,
        unique: definition.unique,
      };

      mongooseSchema[field] = schemaField;
    }

    return new mongoose.Schema(mongooseSchema, {
      timestamps: true,
    });
  }

  /**
   * Convert to PostgreSQL schema
   * @returns {string} PostgreSQL schema SQL
   */
  toPostgresSchema() {
    const fields = Object.entries(this.definition).map(([field, definition]) => {
      const constraints = [];

      if (definition.required) {
        constraints.push('NOT NULL');
      }
      if (definition.unique) {
        constraints.push('UNIQUE');
      }
      if (definition.default !== undefined) {
        const defaultValue = this._getPostgresDefault(definition);
        if (defaultValue !== null) {
          constraints.push(`DEFAULT ${defaultValue}`);
        }
      }

      return `${field} ${this._getPostgresType(definition.type)} ${constraints.join(' ')}`;
    });

    return `
      CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
        id SERIAL PRIMARY KEY,
        ${fields.join(',\n        ')}
      );

      CREATE INDEX IF NOT EXISTS idx_${this.getTableName()}_email ON ${this.getTableName()}(email);
    `;
  }

  /**
   * Get model name
   * @returns {string} Model name
   */
  getModelName() {
    return 'Repo';
  }

  /**
   * Get table name
   * @returns {string} Table name
   */
  getTableName() {
    return 'repos';
  }

  /**
   * Get Mongoose type
   * @private
   * @param {FieldType} type - Field type
   * @returns {any} Mongoose type
   */
  _getMongooseType(type) {
    switch (type) {
    case FieldType.STRING:
      return String;
    case FieldType.NUMBER:
      return Number;
    case FieldType.BOOLEAN:
      return Boolean;
    case FieldType.DATE:
      return Date;
    case FieldType.OBJECT:
      return Object;
    case FieldType.ARRAY:
      return Array;
    default:
      throw new Error(`Unsupported type: ${type}`);
    }
  }

  /**
   * Get PostgreSQL type
   * @private
   * @param {FieldType} type - Field type
   * @returns {string} PostgreSQL type
   */
  _getPostgresType(type) {
    switch (type) {
    case FieldType.STRING:
      return 'VARCHAR(255)';
    case FieldType.NUMBER:
      return 'INTEGER';
    case FieldType.BOOLEAN:
      return 'BOOLEAN';
    case FieldType.DATE:
      return 'TIMESTAMP';
    case FieldType.OBJECT:
    case FieldType.ARRAY:
      return 'JSONB';
    default:
      throw new Error(`Unsupported type: ${type}`);
    }
  }

  /**
   * Get PostgreSQL default value
   * @private
   * @param {Object} definition - Field definition
   * @returns {string|null} PostgreSQL default value
   */
  _getPostgresDefault(definition) {
    if (definition.default === undefined) return null;

    switch (definition.type) {
    case FieldType.STRING:
      return `'${definition.default}'`;
    case FieldType.NUMBER:
      return definition.default.toString();
    case FieldType.BOOLEAN:
      return definition.default.toString();
    case FieldType.DATE:
      return definition.default === Date.now ? 'CURRENT_TIMESTAMP' : `'${definition.default}'`;
    default:
      return null;
    }
  }

  /**
   * Create Mongoose validator
   * @private
   * @param {Object} validate - Validation rules
   * @returns {Object} Mongoose validator
   */
  _createMongooseValidator(validate) {
    if (validate.pattern) {
      return {
        validator: (value) => validate.pattern.test(value),
        message: 'Invalid format',
      };
    }
    return {};
  }
}

module.exports = RepoSchema;
