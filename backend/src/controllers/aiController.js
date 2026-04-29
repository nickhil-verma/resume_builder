const { generateResumeContent } = require('../utils/gemini');

exports.generateAIContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const result = await generateResumeContent(prompt);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: 'AI Generation failed', error: error.message });
  }
};
