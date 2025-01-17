// NPM Modules
const config = require('config');
const express = require('express');
const path = require('path');

// Local Helpers
const logger = require('./helpers/logger');

/**
 * Express application class
 * @class App
 */
class App {
  /**
   * Create Express application
   * @param {Object} appInit - Application initialization parameters
   * @param {number} appInit.port - Port number
   * @param {Function[]} appInit.middleWares - Middleware functions
   * @param {Object[]} appInit.controllers - Controller instances
   * @param {Function[]} appInit.errorHandlers - Error handler functions
   */
  constructor(appInit) {
    if (!appInit || !appInit.port || !appInit.middleWares || !appInit.controllers) {
      throw new Error('Missing required initialization parameters');
    }

    this.app = express();
    this.port = appInit.port;
    this.setupApplication(appInit);
  }

  /**
   * Set up application components
   * @param {Object} appInit - Application initialization parameters
   */
  setupApplication(appInit) {
    try {
      this.middleWare(appInit.middleWares);
      this.assets();
      this.routes(appInit.controllers);
      this.errorHandler(appInit.errorHandlers);
    } catch (error) {
      logger.error('Error setting up application:', error);
      throw error;
    }
  }

  /**
   * Set up middleware
   * @param {Function[]} middleWares - Middleware functions
   */
  middleWare(middleWares) {
    if (!Array.isArray(middleWares)) {
      throw new Error('Middlewares must be an array');
    }

    middleWares.forEach(middleware => {
      if (typeof middleware === 'function') {
        this.app.use(middleware);
      } else {
        logger.warn('Skipping invalid middleware:', middleware);
      }
    });
  }

  /**
   * Set up static assets
   */
  assets() {
    try {
      // Serve static files
      this.app.use(express.static(path.join(__dirname, 'public')));

      // Set view engine
      this.app.set('view engine', 'ejs');
      this.app.set('views', path.join(__dirname, 'views'));

      // Set layout defaults
      this.app.set('layout', 'layouts/main');
      this.app.set('layout extractScripts', true);
      this.app.set('layout extractStyles', true);
    } catch (error) {
      logger.error('Error setting up assets:', error);
      throw error;
    }
  }

  /**
   * Set up routes
   * @param {Object[]} controllers - Controller instances
   */
  routes(controllers) {
    if (!Array.isArray(controllers)) {
      throw new Error('Controllers must be an array');
    }

    controllers.forEach(controller => {
      if (controller.router) {
        this.app.use('/', controller.router);
      } else {
        logger.warn('Skipping invalid controller:', controller);
      }
    });
  }

  /**
   * Set up error handlers
   * @param {Function[]} errorHandlers - Error handler functions
   */
  errorHandler(errorHandlers) {
    if (!Array.isArray(errorHandlers)) {
      throw new Error('Error handlers must be an array');
    }

    errorHandlers.forEach(handler => {
      if (typeof handler === 'function') {
        this.app.use(handler);
      } else {
        logger.warn('Skipping invalid error handler:', handler);
      }
    });
  }

  /**
   * Start the server
   * @returns {Promise<void>}
   */
  listen() {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.port, () => {
          logger.info(`App listening on port ${this.port}`);
          resolve(server);
        });

        server.on('error', (error) => {
          logger.error('Server error:', error);
          reject(error);
        });
      } catch (error) {
        logger.error('Error starting server:', error);
        reject(error);
      }
    });
  }
}

module.exports = App;
