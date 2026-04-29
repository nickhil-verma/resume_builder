const axios = require('axios');

/**
 * Fetches public repositories for a given GitHub username derived from URL.
 */
const fetchUserRepos = async (githubUrl) => {
  try {
    if (!githubUrl) return [];
    
    // Extract username from URL (e.g., github.com/username)
    const username = githubUrl.split('github.com/')[1]?.split('/')[0];
    if (!username) return [];

    const { data } = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    
    return data.map(repo => ({
      name: repo.name,
      description: repo.description || 'No description provided.',
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count
    }));
  } catch (error) {
    console.error('GITHUB_SERVICE_ERROR:', error.message);
    return [];
  }
};

module.exports = { fetchUserRepos };
