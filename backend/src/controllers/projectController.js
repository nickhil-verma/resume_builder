const prisma = require('../config/db');
const { fetchUserRepos } = require('../services/githubService');
const { analyzeProjectsAgainstJD } = require('../services/scoringService');

exports.getGitHubProjects = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.githubUrl) {
      return res.status(400).json({ message: 'GitHub URL not set in profile' });
    }

    const repos = await fetchUserRepos(user.githubUrl);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

exports.analyzeProjects = async (req, res) => {
  try {
    const { jd, projects } = req.body;
    if (!jd || !projects) {
      return res.status(400).json({ message: 'JD and projects are required' });
    }

    const analysis = await analyzeProjectsAgainstJD(jd, projects);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing projects' });
  }
};
