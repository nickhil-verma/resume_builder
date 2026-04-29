const express = require('express');
const { generateAIContent } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/generate', generateAIContent);

module.exports = router;
