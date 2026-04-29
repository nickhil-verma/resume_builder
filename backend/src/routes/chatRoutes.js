const express = require('express');
const { sendMessage, getSessionHistory, getUserSessions } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', sendMessage);
router.get('/sessions', getUserSessions);
router.get('/:sessionId', getSessionHistory);

module.exports = router;
