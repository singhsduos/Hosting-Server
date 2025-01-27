const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth.service');
const axios = require('axios');

class AuthController {
    constructor() {
        this.path = '/auth';
        this.router = express.Router();
        this.authService = new AuthService();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }));
        this.router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/failure' }), this.handleGitHubCallback.bind(this));

        this.router.get('/gitlab', passport.authenticate('gitlab'));
        this.router.get('/gitlab/callback', passport.authenticate('gitlab', { failureRedirect: '/auth/failure' }), this.handleGitLabCallback.bind(this));
    }

    async handleGitHubCallback(req, res) {
        try {
            const { user } = req;

            if (!user) {
                logger.error('GitHub callback: No user found in request');
                return res.redirect('/auth/failure');
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
            res.redirect('/auth/failure'); 
        }
    }

    async handleGitLabCallback(req, res) {
        try {
            const { user } = req;

            if (!user) {
                logger.error('GitLab callback: No user found in request');
                return res.redirect('/auth/failure');
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
            res.redirect('/auth/failure'); 
        }
    }
}

module.exports = AuthController;
