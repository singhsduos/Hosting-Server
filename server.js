// Required first
const dotenv = require('dotenv');
require('express-async-errors');
const config = require('./config/config');

// Load environment variables from the appropriate .env file
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}


// NPM Modules
const cookie = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const session = require('express-session');

// Local Helpers
const ErrorHandler = require('./helpers/error');
const logger = require('./helpers/logger');

// Set up global error handlers
global.appConfig = config;
global.logger = logger;
global.ErrorHandler = ErrorHandler;

// Database
const { initializeDatabase, closeDatabase } = require('./db');

// Controllers
const UserController = require('./controllers/user.controller');

// Middleware
const { accessHeaderMiddleware, getAllowedOrigins } = require('./middlewares/accessHeader');
const { error, invalidPath } = require('./middlewares/error-handler');

// Local Modules
const App = require('./app');

/**
 * Initialize the application
 * @async
 * @returns {Promise<void>}
 */
async function initializeApp() {
  try {
    // Initialize Database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    const app = new App({
      port: process.env.PORT || 3000,
      middleWares: [
        morgan('dev', { skip: avoid }),
        expressLayouts,
        express.json(),
        express.urlencoded({ extended: true }),
        cookie(),
        cors({
          origin: getAllowedOrigins(),
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        }),
        accessHeaderMiddleware,
        session({
          secret: process.env.SESSION_SECRET || 'your-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          },
        }),
      ],
      controllers: [new UserController()],
      errorHandlers: [invalidPath, error],
    });

    await app.listen();
    logger.info(`Server started successfully in ${process.env.NODE_ENV || 'development'} mode`);
  } catch (err) {
    logger.error('Failed to initialize application:', err);
    process.exit(1);
  }
}

// Start the application
initializeApp();

// Global error handlers
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulStopServer();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    promise,
    reason,
  });
  gracefulStopServer();
});

// Graceful shutdown handlers
process.on('SIGINT', gracefulStopServer);
process.on('SIGTERM', gracefulStopServer);

/**
 * Gracefully stop the server
 * @async
 */
async function gracefulStopServer() {
  try {
    logger.info('Initiating graceful shutdown...');
    await closeDatabase();
    logger.info('Database connection closed');
    setTimeout(() => {
      logger.info('Server shutdown complete');
      process.exit(0);
    }, 1000);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
}

/**
 * Check if response should be avoided for logging
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} True if response should be avoided
 */
function avoid(req, res) {
  return res.statusCode === 304;
}
