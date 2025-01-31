const express = require('express');
const path = require('path');
const GitHubCloneService = require('../services/cloneGithub.service.js');
class GitHubCloneController {
  constructor() {
    this.path = '/github';
    this.router = express.Router();
    this.gitHubCloneService = new GitHubCloneService();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/clone', checkAuth, this.cloneRepo.bind(this));
  }

  async cloneRepo(req, res) {
    try {
      const { repoName, branchName } = req.body;
      const username = req.session.passport.user.username;
      const repoUrl = `https://github.com/${username}/${repoName}.git`;
      const destinationPath = path.join(process.cwd(), 'temp', username, repoName);
      const clonedBranch = await this.gitHubCloneService.cloneBranch(
        repoUrl,
        branchName,
        destinationPath
      );
      return res.status(200).json({ message: 'Branch cloned successfully', clonedBranch });
    } catch (error) {
      console.error('Error cloning branch:', error);
      return res.status(500).json({ message: 'Error cloning branch' });
    }
  }
}

module.exports = GitHubCloneController;
