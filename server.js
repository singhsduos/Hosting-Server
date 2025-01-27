const dotenv = require('dotenv');
require('express-async-errors');
const config = require('./config/config');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const cookie = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const GitHubStrategy = require('passport-github2').Strategy;
const GitLabStrategy = require('passport-gitlab2').Strategy;
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');

const ErrorHandler = require('./helpers/error');
const logger = require('./helpers/logger');

global.config = config;
global.logger = logger;
global.ErrorHandler = ErrorHandler;

const { initializeDatabase, closeDatabase } = require('./db');

const AuthController = require('./controllers/auth.controller');

const { accessHeaderMiddleware, getAllowedOrigins } = require('./middlewares/accessHeader');
const { error, invalidPath } = require('./middlewares/error-handler');

const App = require('./app');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${config.frontBaseUrl}/auth/github/callback`,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.use(new GitLabStrategy({
  clientID: process.env.GITLAB_CLIENT_ID,
  clientSecret: process.env.GITLAB_CLIENT_SECRET,
  callbackURL: `${config.frontBaseUrl}/auth/gitlab/callback`,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

async function initializeApp() {
  try {
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
        passport.initialize(),
        passport.session()
      ],
      controllers: [new AuthController()],
      errorHandlers: [invalidPath, error],
    });

    await app.listen();
    logger.info(`Server started successfully in ${process.env.NODE_ENV || 'development'} mode`);
  } catch (err) {
    logger.error('Failed to initialize application:', err);
    process.exit(1);
  }
}

initializeApp();

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

process.on('SIGINT', gracefulStopServer);
process.on('SIGTERM', gracefulStopServer);

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
