const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

/**
 * Direct Fetch call to Gemini API
 */
async function callGeminiAPI(contents) {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Gemini API request failed");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

const SYSTEM_PROMPT = "You are an expert Resume Maker and Career Coach specializing in FAANG and top-tier tech companies. Your goal is to create high-impact, professional, and ATS-optimized content that fits strictly within a one-page resume format. Use action-oriented language, quantify achievements, and maintain a sophisticated professional tone.";

/**
 * Enhanced chat with history support directly from frontend.
 */
export const generateChatResponse = async (history, message) => {
    try {
        let validHistory = [];
        let foundFirstUser = false;

        for (const m of history) {
            if (m.role === 'user') foundFirstUser = true;
            if (foundFirstUser) {
                validHistory.push({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text || m.content }]
                });
            }
        }

        const contents = [
            {
                role: 'user',
                parts: [{ text: `SYSTEM INSTRUCTION: ${SYSTEM_PROMPT}` }]
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I will act as a FAANG-level resume expert, ensuring all content is professional and optimized for a strict one-page format." }]
            },
            ...validHistory,
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        return await callGeminiAPI(contents);
    } catch (error) {
        console.error("Chat AI Error:", error);
        throw error;
    }
};

/**
 * Parses raw resume text into structured JSON.
 */
export const parseResumeText = async (text) => {
    try {
        const prompt = `
            ${SYSTEM_PROMPT}
            Extract information from the following raw resume text and return a valid JSON object.
            Resume Text:
            ${text}

            JSON Schema:
            {
                "name": "Full Name",
                "email": "Email",
                "phone": "Phone",
                "location": "Location",
                "linkedin": "LinkedIn URL",
                "github": "GitHub URL",
                "title": "Professional Title",
                "summary": "Professional Summary",
                "experience": "Experience",
                "projects": "Projects",
                "skills": "Skills"
            }
            
            Return ONLY the JSON object.
        `;

        const contents = [{
            role: 'user',
            parts: [{ text: prompt }]
        }];

        const resultText = await callGeminiAPI(contents);
        const jsonMatch = resultText.match(/\{.*\}/s);
        return JSON.parse(jsonMatch ? jsonMatch[0] : resultText);
    } catch (error) {
        console.error("Parse Error:", error);
        throw new Error("Failed to parse resume content");
    }
};

/**
 * Generates/Rewrites a section.
 */
export const rewriteSectionAI = async ({ sectionName, currentContent, userInstruction, jobTitle, jobDescription }) => {
    try {
        const prompt = `
            ${SYSTEM_PROMPT}
            Rewrite the following resume section professionally for a FAANG application.
            Section: ${sectionName}
            Current Content: ${currentContent || ''}
            User Instruction: ${userInstruction}
            ${jobTitle ? `Target Job Title: ${jobTitle}` : ""}
            ${jobDescription ? `Job Description Context:\n${jobDescription}` : ""}

            Ensure the content is concise enough for a one-page resume but high-impact.
        `;

        const contents = [{
            role: 'user',
            parts: [{ text: prompt }]
        }];

        return await callGeminiAPI(contents);
    } catch (error) {
        console.error("Rewrite AI Error:", error);
        throw error;
    }
};

/**
 * Calculates ATS Score and Match Percentage.
 */
export const calculateATSScoreAI = async (resumeData, jobDescription) => {
    try {
        const prompt = `
            ${SYSTEM_PROMPT}
            Analyze the following resume against the job description from a FAANG recruiter's perspective.
            Resume: ${JSON.stringify(resumeData)}
            JD: ${jobDescription}
            
            Return ONLY a JSON object with:
            {
                "atsScore": (float between 0-100),
                "matchPercentage": (float between 0-100)
            }
        `;

        const contents = [{
            role: 'user',
            parts: [{ text: prompt }]
        }];

        const text = await callGeminiAPI(contents);
        const jsonMatch = text.match(/\{.*\}/s);
        return JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (error) {
        console.error("ATS Error:", error);
        return { atsScore: 70, matchPercentage: 75 }; // Fallback
    }
};
