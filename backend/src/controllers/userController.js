const prisma = require('../config/db');
const { fetchGitHubProjects } = require('../utils/github');

exports.updateProfile = async (req, res) => {
  try {
    const { name, linkedinUrl, githubUrl, codeforces, leetcode, phone, address } = req.body;
    const userId = req.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        name, 
        linkedinUrl, 
        githubUrl,
        codeforces,
        leetcode,
        phone,
        address
      }
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { 
        id: true, name: true, email: true, 
        linkedinUrl: true, githubUrl: true, 
        codeforces: true, leetcode: true,
        phone: true, address: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

exports.getUserGitHubProjects = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.githubUrl) {
      return res.status(400).json({ message: 'GitHub URL not set' });
    }

    const username = user.githubUrl.split('/').pop();
    const projects = await fetchGitHubProjects(username);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GitHub projects' });
  }
};
exports.getSocialLinks = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { 
        linkedinUrl: true, 
        githubUrl: true, 
        codeforces: true, 
        leetcode: true 
      }
    });
    res.json({
      linkedin: user.linkedinUrl,
      github: user.githubUrl,
      codeforces: user.codeforces,
      leetcode: user.leetcode
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social links' });
  }
};

exports.updateSocialLinks = async (req, res) => {
  try {
    const { linkedin, github, codeforces, leetcode } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        linkedinUrl: linkedin,
        githubUrl: github,
        codeforces,
        leetcode
      }
    });
    res.json({ message: 'Social links updated', social: { linkedin, github, codeforces, leetcode } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating social links', error: error.message });
  }
};
