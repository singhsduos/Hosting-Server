const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth.service');

class AuthController {
  constructor() {
    this.path = '/auth';
    this.router = express.Router();
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/login', this.loginPage.bind(this));
    this.router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }));
    this.router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login?error=GitHub authentication failed' }), this.handleGitHubCallback.bind(this));

    this.router.get('/gitlab', passport.authenticate('gitlab'));
    this.router.get('/gitlab/callback',passport.authenticate('gitlab', { failureRedirect:  '/auth/login?error=GitLab authentication failed' }), this.handleGitLabCallback.bind(this));
  }

  async loginPage(req, res) {
    return res.render('pages/login/login');
  }

  async handleGitHubCallback(req, res) {
    try {
      const { user } = req;

      if (!user) {
        logger.error('GitHub callback: No user found in request');
        return res.redirect('/auth/login?error=No user found!');
      }

      const userData = {
        username: user.username || user.displayName || 'Unknown',
        email: user._json.email || 'No email available',
        profile_picture: user.photos?.[0]?.value || null,
        origin: 'Github',
        isActive: true,
      };

      await this.authService.registerUser(userData);

      logger.info(`GitHub user registered/updated: ${userData.username}`);
      res.redirect('/');
    } catch (err) {
      logger.error('Error during GitHub callback:', err);
      if(err.message === 'Email already registered with this origin provider Github') {
        return res.redirect('/auth/login?error=Email already registered with this origin provider Github');
      }
      if(err.message === 'No user found in request') {
        return res.redirect('/auth/login?error=No user found!');
      }
      res.redirect('/auth/login?error=GitHub authentication failed');
    }
  }

  async handleGitLabCallback(req, res) {
    try {
      const { user } = req;

      if (!user) {
        logger.error('GitLab callback: No user found in request');
        return res.redirect('/auth/login?error=GitLab authentication failed');
      }

      const userData = {
        username: user.username || user.displayName || 'Unknown',
        email: user._json.email || 'No email available',
        profile_picture: user.avatarUrl || null,
        origin: 'Gitlab',
        isActive: true,
      };

      await this.authService.registerUser(userData);

      logger.info(`GitLab user registered/updated: ${userData.username}`);
      res.redirect('/');
    } catch (err) {
      logger.error('Error during GitLab callback:', err);
      if(err.message === 'Email already registered with this origin provider Gitlab') {
        return res.redirect('/auth/login?error=Email already registered with this origin provider Gitlab');
      }
      if(err.message === 'No user found in request') {
        return res.redirect('/auth/login?error=No user found!');
      }
      res.redirect('/auth/login?error=GitLab authentication failed');
    }
  }
}

module.exports = AuthController;
