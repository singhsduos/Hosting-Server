const ModelFactory = require('../models/ModelFactory');
const { hash, compare } = require('bcrypt');

class AuthService {
  constructor() {
    this.userModel = ModelFactory.createModel('user');
  }

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

  async getUserById(id) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(userData) {
    if (!this._isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await this.userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    if (userData.password) {
      userData.password = await this._hashPassword(userData.password);
    }

    userData.isActive = userData.isActive ?? true;
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    return this.userModel.create(userData);
  }

  async updateUser(id, updateData) {
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

    if (updateData.password) {
      updateData.password = await this._hashPassword(updateData.password);
    }

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

  async deleteUser(id) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

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

  async registerUser(userData) {
    if (!this._isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await this.userModel.findOne({ email: userData.email, origin: userData.origin });
    if (existingUser) {
      throw new Error(`Email already registered with this origin provider ${userData.origin}`);
    }

    if (userData.password) {
      userData.password = await this._hashPassword(userData.password);
    }

    userData.isActive = userData.isActive ?? true;
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    return this.userModel.create(userData);
  }

  async _hashPassword(password) {
    return hash(password, 10);
  }

  async _comparePasswords(plainPassword, hashedPassword) {
    return compare(plainPassword, hashedPassword);
  }

  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = AuthService;
