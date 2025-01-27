const express = require('express');
const HomeService = require('../services/home.service.js');

class HomeController {
  constructor() {
    this.path = '/home';
    this.router = express.Router();
    this.homeService = new HomeService();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getHome.bind(this));
  }

  async getHome(req, res) {
    try {
      const data = await this.homeService.getHomeData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching home data' });
    }
  }
}

module.exports = HomeController;
