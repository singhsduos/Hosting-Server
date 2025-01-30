const express = require('express');
const HomeService = require('../services/home.service.js');
class HomeController {
  constructor() {
    this.path = '';
    this.router = express.Router();
    this.homeService = new HomeService();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', checkAuth, this.getHome.bind(this));
    this.router.get('/fetch-branches', checkAuth, this.getBranches.bind(this)); // New route for fetching branches
  }

  async getHome(req, res) {
    try {
      const accessToken = req.session.passport.user.accessToken;
      const repos = await this.homeService.fetchRepos(accessToken);
      return res.render('pages/home/home', { repos });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching home data' });
    }
  }

  async getBranches(req, res) {
    try {
      const accessToken = req.session.passport.user.accessToken;
      const { owner, repoName } = req.query;
      if (!owner || !repoName) {
        return res.status(400).json({ message: 'Owner and repoName are required' });
      }

      const branches = await this.homeService.fetchBranches(accessToken, owner, repoName);
      return res.json(branches).status(200);
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).json({ message: 'Error fetching branches' });
    }
  }
}

module.exports = HomeController;
