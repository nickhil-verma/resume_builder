const validateResumeData = (data) => {
  const errors = [];
  const validTemplates = ['modern', 'minimal', 'classic', 'designer'];

  if (!data.title) errors.push('Resume title is required');
  if (!data.personalInfo || !data.personalInfo.name || !data.personalInfo.email) {
    errors.push('Personal info (Name and Email) is required');
  }
  
  if (data.template && !validTemplates.includes(data.template)) {
    errors.push(`Invalid template. Choose from: ${validTemplates.join(', ')}`);
  }

  // Length check for summaries to prevent database bloat
  if (data.summary && data.summary.length > 5000) {
    errors.push('Summary is too long (max 5000 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateResumeData };
