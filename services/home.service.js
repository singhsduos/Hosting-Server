const axios = require('axios');
const githubApiUrl = 'https://api.github.com/user/repos';

class HomeService {
  async fetchRepos(accessToken) {
    try {
      const response = await axios.get(githubApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });

      const repos = response.data;
      return repos;
    } catch (error) {
      console.error(
        'Error fetching repositories:',
        error.response ? error.response.data : error.message
      );
    }
  }
}

module.exports = HomeService;
