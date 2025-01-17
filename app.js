// NPM Modules
const config = require('config');
const express = require('express');
const path = require('path');

// Local Modules
const { dbConnect } = require('./db/mongodb');

module.exports = class App {
  constructor(appInit) {
    if (!appInit || !appInit.port || !appInit.middleWares || !appInit.controllers) {
      throw new Error('Missing required initialization parameters');
    }

    this.app = express();
    this.port = appInit.port;
    this.setupApplication(appInit);
  }

  setupApplication(appInit) {
    try {
      this.middleWare(appInit.middleWares);
      this.assets();
      this.routes(appInit.controllers);
      this.errorHandler(appInit.errorHandlers);
      this.initDatabse();
    } catch (error) {
      logger.error('Error setting up application:', error);
      throw error;
    }
  }

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

  assets() {
    try {
      // Serve static files
      this.app.use(express.static(path.join(__dirname, 'public')));
      
      // Set up view engine
      this.app.set('views', path.join(__dirname, 'views'));
      this.app.set('layout', './layouts/layout');
      this.app.set('view engine', 'ejs');
    } catch (error) {
      logger.error('Error setting up assets:', error);
      throw error;
    }
  }

  routes(controllers) {
    if (!Array.isArray(controllers)) {
      throw new Error('Controllers must be an array');
    }

    controllers.forEach(controller => {
      if (!controller || !controller.path || !controller.router) {
        logger.warn('Invalid controller configuration:', controller);
        return;
      }
      this.app.use('/api/v1' + controller.path, controller.router);
    });
  }

  errorHandler(errorHandlers) {
    if (!Array.isArray(errorHandlers)) {
      throw new Error('Error handlers must be an array');
    }

    errorHandlers.forEach(errorHandler => {
      if (typeof errorHandler === 'function') {
        this.app.use(errorHandler);
      } else {
        logger.warn('Skipping invalid error handler:', errorHandler);
      }
    });
  }

  async initDatabse() {
    try {
      await dbConnect();
      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw error;
    }
  }

  listen() {
    try {
      const server = this.app.listen(this.port, () => {
        logger.info(`App listening on ${config.get('url.site_url')}/api/v1`);
        logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
      });

      server.on('error', (error) => {
        logger.error('Server error:', error);
        process.exit(1);
      });

      return server;
    } catch (error) {
      logger.error('Failed to start server:', error);
      throw error;
    }
  }
}
