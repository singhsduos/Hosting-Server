const { exec } = require('child_process');
const fs = require('fs');

class GitHubCloneService {
  async cloneBranch(repoUrl, branchName, destinationPath) {
    try {
      if (!repoUrl || typeof repoUrl !== 'string') {
        throw new Error('Invalid repository URL.');
      }
      if (!branchName || typeof branchName !== 'string') {
        throw new Error('Invalid branch name.');
      }
      if (!destinationPath || typeof destinationPath !== 'string') {
        throw new Error('Invalid destination path.');
      }

      if (fs.existsSync(destinationPath)) {
        throw new Error(
          `The destination path "${destinationPath}" already exists. Please choose a different path.`
        );
      }

      const command = `git clone --branch ${branchName} ${repoUrl} ${destinationPath}`;
      console.log(`Executing: ${command}`);

      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            if (stderr.includes('fatal: Remote branch')) {
              return reject(`Branch "${branchName}" does not exist in the repository.`);
            }
            return reject(`Clone failed: ${stderr}`);
          }

          const successMessage = {
            message: `Branch "${branchName}" was successfully cloned.`,
            repoUrl: repoUrl,
            branchName: branchName,
            destinationPath: destinationPath,
            details: stdout,
          };
          resolve(successMessage);
        });
      });
    } catch (error) {
      console.error(`Error in cloneBranch: ${error.message}`);
      throw error;
    }
  }
}

module.exports = GitHubCloneService;
