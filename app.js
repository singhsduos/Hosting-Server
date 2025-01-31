const express = require('express');
const path = require('path');

class App {
  constructor(appInit) {
    if (!appInit || !appInit.port || !appInit.middleWares || !appInit.controllers) {
      throw new Error('Missing required initialization parameters');
    }

    this.app = express();
    this.port = appInit.port;
    this.setupApplication(appInit);
  }

  setupApplication(appInit) {
    this.middleWare(appInit.middleWares);
    this.assets();
    this.routes(appInit.controllers);
    this.errorHandler(appInit.errorHandlers);
  }

  middleWare(middleWares) {
    middleWares.forEach((middleware) => {
      if (typeof middleware === 'function') {
        this.app.use(middleware);
      }
    });
  }

  assets() {
    this.app.use(express.static('public'));
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('layout', 'layouts/layout');
    this.app.use((req, res, next) => {
      res.locals.TOKEN = req.session.token;
      next();
    });
  }

  routes(controllers) {
    controllers.forEach((controller) => {
      if (controller.router) {
        this.app.use(controller.path, controller.router);
      }
    });
  }

  errorHandler(errorHandlers) {
    errorHandlers.forEach((handler) => {
      this.app.use(handler);
    });
  }

  listen() {
    return new Promise((resolve, reject) => {
      const server = this.app.listen(this.port, () => {
        logger.info(`App listening on port ${this.port}`);
        resolve(server);
      });

      server.on('error', (error) => {
        logger.error('Server error:', error);
        reject(error);
      });
    });
  }
}

module.exports = App;
