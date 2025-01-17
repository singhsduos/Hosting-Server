const express = require('express');
const UserService = require('../services/user.service');

/**
 * User Controller class
 * @class UserController
 */
class UserController {
  /**
   * Create a new UserController instance
   */
  constructor() {
    this.path = '/users';
    this.router = express.Router();
    this.userService = new UserService();
    this.initializeRoutes();
  }

  /**
   * Initialize controller routes
   * @private
   */
  initializeRoutes() {
    // GET routes
    this.router.get('/', this.getAllUsers.bind(this));
    this.router.get('/:id', this.getUserById.bind(this));

    // POST routes
    this.router.post('/', this.createUser.bind(this));
    this.router.post('/login', this.loginUser.bind(this));

    // PUT routes
    this.router.put('/:id', this.updateUser.bind(this));

    // DELETE routes
    this.router.delete('/:id', this.deleteUser.bind(this));
  }

  /**
   * Get all users with pagination
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next function
   */
  async getAllUsers(req, res, next) {
    try {
      const filters = {};
      if (req.query.isActive) filters.isActive = req.query.isActive === 'true';
      if (req.query.email) filters.email = new RegExp(req.query.email, 'i');

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await this.userService.getAllUsers(filters, options);
      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next function
   */
  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, error: error.message });
      }
      next(error);
    }
  }

  /**
   * Create a new user
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next function
   */
  async createUser(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      if (error.message.includes('Email')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      next(error);
    }
  }

  /**
   * Login user
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next function
   */
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.authenticateUser(email, password);

      // Set user session
      req.session.user = {
        id: user._id,
        email: user.email,
        name: user.name
      };

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  /**
   * Update user by ID
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next function
   */
  async updateUser(req, res, next) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, error: error.message });
      }
      if (error.message.includes('Email')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      next(error);
    }
  }

  /**
   * Delete user by ID
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next function
   */
  async deleteUser(req, res, next) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, error: error.message });
      }
      next(error);
    }
  }
}

module.exports = UserController;
