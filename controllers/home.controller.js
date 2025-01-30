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
  }

  async getHome(req, res) {
    try {
      return res.render('pages/home/home');
    } catch (error) {
      res.status(500).json({ message: 'Error fetching home data' });
    }
  }
}

module.exports = HomeController;
