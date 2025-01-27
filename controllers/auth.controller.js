const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth.service');
const axios = require('axios');

/**
 * Auth Controller class
 * @class AuthController
 */
class AuthController {
    /**
     * Create a new AuthController instance
     */
    constructor() {
        this.path = '/auth';
        this.router = express.Router();
        this.authService = new AuthService();
        this.initializeRoutes();
    }

    /**
     * Initialize controller routes
     * @private
     */
    initializeRoutes() {
        // GitHub OAuth routes
        this.router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }));
        this.router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/failure' }), this.handleGitHubCallback.bind(this));

        // GitLab OAuth routes
        this.router.get('/gitlab', passport.authenticate('gitlab'));
        this.router.get('/gitlab/callback', passport.authenticate('gitlab', { failureRedirect: '/auth/failure' }), this.handleGitLabCallback.bind(this));
    }

    /**
     * Handle GitHub OAuth callback
     * @param {express.Request} req - Express request object
     * @param {express.Response} res - Express response object
     */
    async handleGitHubCallback(req, res) {
        try {
            const { user } = req;

            if (!user) {
                logger.error('GitHub callback: No user found in request');
                return res.redirect('/auth/failure');
            }

            // Prepare user data for saving
            const userData = {
                username: user.username || user.displayName || 'Unknown',
                email: user._json.email || 'No email available',
                profile_picture: user.photos?.[0]?.value || null,
                origin: 'Github',
                isActive: true,
            };

            // Use AuthService to save or update user data
            await this.authService.registerUser(userData);

            logger.info(`GitHub user registered/updated: ${userData.username}`);
            res.redirect('/'); // Redirect to home or success page
        } catch (err) {
            logger.error('Error during GitHub callback:', err);
            res.redirect('/auth/failure'); // Redirect to failure page
        }
    }

    /**
     * Handle GitLab OAuth callback
     * @param {express.Request} req - Express request object
     * @param {express.Response} res - Express response object
     */
    async handleGitLabCallback(req, res) {
        try {
            const { user } = req;

            if (!user) {
                logger.error('GitLab callback: No user found in request');
                return res.redirect('/auth/failure');
            }
            console.log("user",user)

            // Prepare user data for saving
            const userData = {
                username: user.username || user.displayName || 'Unknown',
                email: user._json.email || 'No email available',
                profile_picture: user.avatarUrl || null,
                origin: 'Gitlab',
                isActive: true,
            };

            // Use AuthService to save or update user data
            await this.authService.registerUser(userData);

            logger.info(`GitLab user registered/updated: ${userData.username}`);
            res.redirect('/'); // Redirect to home or success page
        } catch (err) {
            logger.error('Error during GitLab callback:', err);
            res.redirect('/auth/failure'); // Redirect to failure page
        }
    }
}

module.exports = AuthController;
