const express = require('express');
const { getGitHubProjects, analyzeProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/github', getGitHubProjects);
router.post('/analyze', analyzeProjects);

module.exports = router;
