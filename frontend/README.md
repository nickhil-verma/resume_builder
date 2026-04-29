# Next.js Frontend - AI Resume Builder

The frontend application provides a high-fidelity, interactive interface for building and optimizing resumes.

## ✨ Features
- **Live Preview**: Real-time rendering of your resume as you type.
- **AI Chat Assistant**: Direct browser-to-Gemini chat with conversation history.
- **ATS Dashboard**: Sidebar analytics for job description matching.
- **Style Switcher**: Toggle between Modern, Classic, and Minimal layouts.
- **Export**: One-click PDF export optimized for print.

## 🛠️ Setup
1. **Install Dependencies**: `npm install`
2. **Environment Variables**: Create a `.env` file with:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   ```
3. **Run Development Server**: `npm run dev`

## 📁 Project Structure & File Usecases

### `src/app/resumecompiler/page.jsx`
The **Heart of the Platform**. This file manages the complex state of the resume editor, handles the real-time high-fidelity preview, and coordinates the AI chat and ATS analysis features.

### `src/lib/gemini.js`
The **Direct AI Bridge**. Implements low-latency communication with the Gemini 1.5 Flash API using direct `fetch` calls. It handles:
- **Role Validation**: Ensures chat history starts with a user role.
- **JSON Parsing**: Extracts structured resume data from raw AI responses.
- **ATS Logic**: Performs comparative analysis between resumes and JDs.

### `src/lib/api.js`
Standardized **Axios Client** for communicating with the backend API. Handles automatic JWT token injection for authenticated requests.

### `src/components/Sidebar.jsx`
The global **Navigation Sidebar** that provides consistent access to the Dashboard, Analytics, and Compiler across the application.

### `src/app/layout.js`
The **Global Shell**. Configures the `Instrument Serif` and `DM Sans` font loaders and sets up the primary layout structure for the Next.js application.

