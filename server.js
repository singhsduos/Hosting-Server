// Required first
require('dotenv').config();
require('express-async-errors');

// NPM Modules
const config = require('config');
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
global.logger = logger;
global.ErrorHandler = ErrorHandler;

// Database
const { initializeDatabase, closeDatabase } = require('./db');

// Controllers
const { BSPController } = require('./controllers/bsp.controller');
const { MPaisaController } = require('./controllers/mPaisa.controller');
const { MyCashController } = require('./controllers/mycash.controller');

// Middleware
const { accessHeaderMiddleware, getAllowedOrigins } = require('./middlewares/accessHeader');
const { error, invalidPath } = require('./middlewares/error-handler');

// Local Modules
const App = require('./app');

// Configuration
const env_url = config.get('CONFIGURATION.APIURL');
const front_url = config.get('CONFIGURATION.FRONTBASEURL');

// Initialize Database
initializeDatabase().catch(err => {
  logger.error('Failed to initialize database:', err);
  process.exit(1);
});

const app = new App({
  port: config.get('SECRETCONFIGURATION.PORT') || 20108,
  middleWares: [
    accessHeaderMiddleware,
    morgan('dev', { skip: avoid }),
    expressLayouts,
    express.json(),
    express.urlencoded({ extended: true }),
    cookie(),
    cors({
      origin: getAllowedOrigins(),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }),
    session({
      secret: config.get('SESSION_SECRET') || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  ],
  controllers: [
    new BSPController(),
    new MPaisaController(),
    new MyCashController()
  ],
  errorHandlers: [invalidPath, error]
});

// Global error handlers
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  gracefulStopServer();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    promise,
    reason
  });
  gracefulStopServer();
});

// Graceful shutdown handlers
process.on('SIGINT', gracefulStopServer);
process.on('SIGTERM', gracefulStopServer);

app.listen();

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

function avoid(req, res) {
  return res.statusCode === 304;
}
