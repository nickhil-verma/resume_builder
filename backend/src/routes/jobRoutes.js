const express = require('express');
const { addJobApplication, getJobApplications, getJobById, deleteJob } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', addJobApplication);
router.get('/', getJobApplications);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);

module.exports = router;
