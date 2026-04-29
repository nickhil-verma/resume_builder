const axios = require('axios');

/**
 * Fetches public repositories for a given GitHub username.
 */
const fetchGitHubProjects = async (username) => {
  if (!username) return [];
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    return response.data.map(repo => ({
      name: repo.name,
      description: repo.description || "No description provided",
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count
    }));
  } catch (error) {
    console.error("GitHub API Error:", error.message);
    return [];
  }
};

module.exports = { fetchGitHubProjects };
