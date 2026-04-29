const express = require('express');
const { 
  createResume, 
  getResumes, 
  getResumeById, 
  deleteResume,
  updateResume,
  getResumeCount,
  rewriteSection
} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const { 
  downloadPDF, 
  downloadDOCX 
} = require('../controllers/downloadController');

router.use(authMiddleware);

router.get('/:id/download/pdf', downloadPDF);
router.get('/:id/download/docx', downloadDOCX);

router.get('/count', getResumeCount);
router.post('/rewrite', rewriteSection);
router.post('/', createResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;
