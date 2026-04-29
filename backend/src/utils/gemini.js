const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = "You are an expert Resume Maker and Career Coach specializing in FAANG and top-tier tech companies. Your goal is to create high-impact, professional, and ATS-optimized content that fits strictly within a one-page resume format. Use action-oriented language, quantify achievements, and maintain a sophisticated professional tone.";

/**
 * Generates content using Gemini or returns a mock response if disabled.
 */
const generateResumeContent = async (prompt) => {
  const useGemini = process.env.USE_GEMINI === 'true';

  if (!useGemini) {
    return "AI Bypass: This is a tailored summary highlighting expertise in full-stack development and strategic problem-solving.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Prepend system prompt for consistency
    const fullPrompt = `${SYSTEM_PROMPT}\n\nTask: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content from Gemini AI.");
  }
};

/**
 * Tailors a resume summary based on a Job Description (JD).
 */
const generateTailoredSummary = async (skills, experience, jobDescription) => {
  const prompt = `
    As an expert career coach, write a high-impact, professional resume summary (3-4 sentences).
    
    Job Description: ${jobDescription}
    User Skills: ${skills.join(', ')}
    User Experience: ${JSON.stringify(experience)}
    
    Focus on aligning the user's top skills with the JD requirements. Keep it professional and ATS-optimized.
  `;
  return await generateResumeContent(prompt);
};

/**
 * Calculates ATS Score and Match Percentage.
 */
const calculateATSScore = async (resumeData, jobDescription) => {
  const useGemini = process.env.USE_GEMINI === 'true';
  if (!useGemini) {
    return {
      atsScore: Math.floor(Math.random() * (95 - 65) + 65),
      matchPercentage: Math.floor(Math.random() * (90 - 60) + 60)
    };
  }

  const prompt = `
    Analyze the following resume against the job description from a FAANG perspective.
    Resume: ${JSON.stringify(resumeData)}
    JD: ${jobDescription}
    
    Return ONLY a JSON object with:
    {
      "atsScore": (float between 0-100),
      "matchPercentage": (float between 0-100)
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${prompt}`);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{.*\}/s);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (error) {
    return { atsScore: 70, matchPercentage: 75 }; // Fallback
  }
};

/**
 * Enhanced chat with history support.
 */
const generateChatResponse = async (messages) => {
  const useGemini = process.env.USE_GEMINI === 'true';
  if (!useGemini) {
    return "AI Bypass: I can help you optimize your projects or tailor your skills for this specific JD.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${SYSTEM_PROMPT}` }] },
        { role: 'model', parts: [{ text: "Understood. I am now in FAANG-expert mode and will ensure all resume content is high-impact and strictly one-page." }] },
        ...messages.slice(0, -1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }))
      ]
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Chat AI Error:", error);
    return "I'm having trouble processing your request right now. How else can I assist with your resume?";
  }
};

module.exports = { 
  generateResumeContent, 
  generateTailoredSummary, 
  calculateATSScore, 
  generateChatResponse 
};
