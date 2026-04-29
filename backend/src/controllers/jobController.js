const prisma = require('../config/db');

exports.addJobApplication = async (req, res) => {
  try {
    const { 
      companyName, 
      jobTitle, 
      jobDescription, 
      resumeId, 
      atsScore, 
      matchPercentage, 
      notes 
    } = req.body;
    const userId = req.userId;

    const application = await prisma.jobApplication.create({
      data: {
        userId,
        resumeId,
        companyName,
        jobTitle,
        jobDescription,
        atsScore: parseFloat(atsScore),
        matchPercentage: parseFloat(matchPercentage),
        notes
      }
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error adding job application', error: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.userId },
      include: { resume: { select: { title: true } } },
      orderBy: { appliedAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
      include: { resume: true }
    });

    if (!application || application.userId !== req.userId) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await prisma.jobApplication.delete({
      where: { id: req.params.id, userId: req.userId }
    });
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application' });
  }
};
