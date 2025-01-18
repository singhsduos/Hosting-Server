const Model = require('../interfaces/Model');
const { getDatabase } = require('../../db');

/**
 * PostgreSQL User model implementation
 * @class PostgresUserModel
 * @extends {Model}
 */
class PostgresUserModel extends Model {
  /**
   * Create PostgreSQL User model
   * @param {import('../schemas/UserSchema')} schema - User schema
   */
  constructor(schema) {
    super();
    this.schema = schema;
    this.tableName = schema.getTableName();
  }

  /**
   * Create a new user
   * @async
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
    const db = getDatabase();
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`);

    const query = `
      INSERT INTO ${this.tableName}
      (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result[0];
  }

  /**
   * Find users
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} Found users
   */
  async find(filter) {
    const db = getDatabase();
    const { whereClause, values } = this._buildWhereClause(filter);

    const query = `
      SELECT *
      FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ''}
    `;

    return db.query(query, values);
  }

  /**
   * Find one user
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object>} Found user
   */
  async findOne(filter) {
    const db = getDatabase();
    const { whereClause, values } = this._buildWhereClause(filter);

    const query = `
      SELECT *
      FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ''}
      LIMIT 1
    `;

    const results = await db.query(query, values);
    return results[0];
  }

  /**
   * Update users
   * @async
   * @param {Object} filter - Filter criteria
   * @param {Object} update - Update data
   * @returns {Promise<Object>} Update result
   */
  async update(filter, update) {
    const db = getDatabase();
    const { whereClause, values: filterValues } = this._buildWhereClause(filter);
    const { setClause, values: updateValues } = this._buildSetClause(update);

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      ${whereClause ? `WHERE ${whereClause}` : ''}
      RETURNING *
    `;

    return db.query(query, [...updateValues, ...filterValues]);
  }

  /**
   * Delete users
   * @async
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object>} Delete result
   */
  async delete(filter) {
    const db = getDatabase();
    const { whereClause, values } = this._buildWhereClause(filter);

    const query = `
      DELETE FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ''}
      RETURNING *
    `;

    return db.query(query, values);
  }

  /**
   * Build WHERE clause
   * @private
   * @param {Object} filter - Filter criteria
   * @returns {Object} WHERE clause and values
   */
  _buildWhereClause(filter) {
    const conditions = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(filter)) {
      conditions.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    return {
      whereClause: conditions.length ? conditions.join(' AND ') : '',
      values,
    };
  }

  /**
   * Build SET clause
   * @private
   * @param {Object} update - Update data
   * @returns {Object} SET clause and values
   */
  _buildSetClause(update) {
    const sets = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(update)) {
      sets.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    return {
      setClause: sets.join(', '),
      values,
    };
  }
}

module.exports = PostgresUserModel;
