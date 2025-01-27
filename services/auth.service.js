const ModelFactory = require('../models/ModelFactory');
const { hash, compare } = require('bcrypt');

/**
 * AuthService class for handling user-related business logic
 * @class AuthService
 */
class AuthService {
  constructor() {
    this.userModel = ModelFactory.createModel('user');
  }

  /**
   * Get all users with optional filtering and pagination
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<Array>} List of users
   */
  async getAllUsers(filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const users = await this.userModel
      .find(filters)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await this.userModel.count(filters);

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    // Validate email format
    if (!this._isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    if (userData.password) {
      userData.password = await this._hashPassword(userData.password);
    }

    // Set default values
    userData.isActive = userData.isActive ?? true;
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    return this.userModel.create(userData);
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updateData) {
    // Don't allow email change if it already exists
    if (updateData.email) {
      if (!this._isValidEmail(updateData.email)) {
        throw new Error('Invalid email format');
      }

      const existingUser = await this.userModel.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Hash new password if provided
    if (updateData.password) {
      updateData.password = await this._hashPassword(updateData.password);
    }

    // Update timestamp
    updateData.updatedAt = new Date();

    const user = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async deleteUser(id) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Authenticate user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authenticated user
   */
  async authenticateUser(email, password) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await this._comparePasswords(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  /**
   * Register user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Registered user
   */
  async registerUser(userData) {
     // Validate email format
     if (!this._isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
     }

  // Check if email already exists
  const existingUser = await this.userModel.findOne({ email: userData.email, origin: userData.origin });
  if (existingUser) {
      throw new Error(`Email already registered with this origin provider ${userData.origin}`);
  }

  // Only hash the password if it is provided
  if (userData.password) {
      userData.password = await this._hashPassword(userData.password);
  }

  // Set default values
  userData.isActive = userData.isActive ?? true;
  userData.createdAt = new Date();
  userData.updatedAt = new Date();

  return this.userModel.create(userData);

  }

  /**
   * Hash password
   * @private
   * @param {string} password - Plain password
   * @returns {Promise<string>} Hashed password
   */
  async _hashPassword(password) {
    return hash(password, 10);
  }

  /**
   * Compare passwords
   * @private
   * @param {string} plainPassword - Plain password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} True if passwords match
   */
  async _comparePasswords(plainPassword, hashedPassword) {
    return compare(plainPassword, hashedPassword);
  }

  /**
   * Validate email format
   * @private
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = AuthService;
