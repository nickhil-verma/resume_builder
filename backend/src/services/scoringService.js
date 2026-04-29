const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes projects against a Job Description.
 * Returns scores and tailoring suggestions.
 */
const analyzeProjectsAgainstJD = async (jd, projects) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze these GitHub projects against the Job Description (JD).
      JD: "${jd}"
      Projects: ${JSON.stringify(projects)}
      
      Tasks:
      1. Score each project based on JD relevance.
      2. Extract 2-3 key "Achievements" (measurable results) from these projects.
      3. Extract any "Certifications" or notable recognitions mentioned or implied.
      4. For achievements, provide an "embeddedLink" to the specific file or repo if possible.

      Return a JSON object with:
      {
        "projects": [
          {
            "name": "Project Name",
            "matchScore": 85,
            "relevance": "High",
            "suggestion": "Brief tip",
            "keywords": ["tech1", "tech2"]
          }
        ],
        "achievements": [
          { "text": "Achievement description", "link": "url" }
        ],
        "certifications": [
          { "name": "Cert name", "issuer": "Issuer", "link": "url" }
        ]
      }
      
      CRITICAL: Return ONLY the raw JSON object. No markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Improved JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in AI response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('SCORING_SERVICE_ERROR:', error.message);
    // Fallback Mock Scoring
    return {
      projects: projects.map(p => ({
        name: p.name,
        matchScore: 50,
        relevance: "Medium",
        suggestion: "AI Analysis currently unavailable. Focus on tech stack.",
        keywords: ["GitHub", "Code"]
      })),
      achievements: [],
      certifications: []
    };
  }
};

module.exports = { analyzeProjectsAgainstJD };
