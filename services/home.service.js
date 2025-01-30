const axios = require('axios');
const githubApiUrl = 'https://api.github.com/user/repos';
const githubBranchesUrl = 'https://api.github.com/repos/';

class HomeService {
  async fetchRepos(accessToken) {
    try {
      const response = await axios.get(githubApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  async fetchBranches(accessToken, owner, repoName) {
    try {
      const response = await axios.get(`${githubBranchesUrl}${owner}/${repoName}/branches`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const branches = response.data;
      return branches;
    } catch (error) {
      console.error(
        `Error fetching branches for ${repoName}:`,
        error.response ? error.response.data : error.message
      );
      throw new Error('Unable to fetch branches');
    }
  }
}

module.exports = HomeService;
