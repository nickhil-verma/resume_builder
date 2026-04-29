const express = require('express');
const { updateProfile, getProfile, getUserGitHubProjects, getSocialLinks, updateSocialLinks } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/github-projects', getUserGitHubProjects);
router.get('/social', getSocialLinks);
router.put('/social', updateSocialLinks);

module.exports = router;
