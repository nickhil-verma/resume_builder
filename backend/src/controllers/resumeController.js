const prisma = require('../config/db');
const { generateTailoredSummary, calculateATSScore } = require('../utils/gemini');
const { validateResumeData } = require('../utils/validators');

exports.createResume = async (req, res) => {
  try {
    const { 
      title, jobTitle, jobDescription, template, 
      personalInfo, education, skills, projects, 
      experience, summary, achievements, certifications, sections
    } = req.body;
    const userId = req.userId;

    // 1. Validate Input
    const validation = validateResumeData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    let tailoredSummary = null;
    let atsData = { atsScore: 0, matchPercentage: 0 };

    // 2. Handle AI Tailoring - ONLY if there is content to tailor
    const hasContent = (skills && skills.length > 0) || (experience && experience.length > 0);
    
    if (jobDescription && hasContent) {
      try {
        tailoredSummary = await generateTailoredSummary(skills || [], experience || [], jobDescription);
        const resumeData = { skills: skills || [], experience: experience || [], summary: tailoredSummary || summary };
        atsData = await calculateATSScore(resumeData, jobDescription);
      } catch (aiError) {
        console.error('AI_TAILORING_SKIP:', aiError.message);
      }
    }

    // 3. Save Structured JSON Data
    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        jobTitle,
        jobDescription,
        template: template || 'modern',
        personalInfo,
        education,
        skills,
        projects,
        experience,
        summary,
        achievements,
        certifications,
        sections,
        tailoredSummary,
        embeddings: atsData // Storing match data in embeddings field for now
      }
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('CREATE RESUME ERROR:', error);
    res.status(500).json({ message: 'Error creating resume', error: error.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existingResume = await prisma.resume.findFirst({
      where: { id, userId }
    });

    if (!existingResume) {
      return res.status(404).json({ message: 'Resume not found or unauthorized' });
    }

    const resume = await prisma.resume.update({
      where: { id },
      data: req.body
    });

    res.json({ message: 'Resume updated successfully', resume });
  } catch (error) {
    console.error('UPDATE RESUME ERROR:', error);
    res.status(500).json({ message: 'Error updating resume', error: error.message });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' } // Changed from updatedAt to createdAt temporarily for stability
    });
    res.json(resumes);
  } catch (error) {
    console.error('GET RESUMES ERROR:', error);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    await prisma.resume.delete({ 
      where: { id: req.params.id, userId: req.userId } 
    });
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume' });
  }
};

exports.getResumeCount = async (req, res) => {
  try {
    const count = await prisma.resume.count({
      where: { userId: req.userId }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error counting resumes' });
  }
};

exports.rewriteSection = async (req, res) => {
  try {
    const { sectionName, currentContent, userInstruction, jobTitle, jobDescription } = req.body;
    const { generateResumeContent } = require('../utils/gemini');
    
    const prompt = `Rewrite the following resume section professionally.
Section: ${sectionName}
Current Content:
${currentContent || ''}

User Instruction: ${userInstruction}
${jobTitle ? `Target Job Title: ${jobTitle}` : ""}
${jobDescription ? `Job Description Context:\n${jobDescription}` : ""}

Return ONLY the improved text. No explanations. No section headers. Preserve bullet points.`;

    const improved = await generateResumeContent(prompt);
    res.json({ content: improved });
  } catch (error) {
    console.error('Rewrite Error:', error);
    res.status(500).json({ message: 'Failed to rewrite section' });
  }
};

