# Synopsis

**TITLE**: AI Resume Generator Web Application

### 1. Introduction
The AI Resume Generator is a high-fidelity web application designed to bridge the gap between job seekers and top-tier tech companies. Leveraging state-of-the-art Generative AI (Google Gemini 1.5 Flash), the platform automates the complex task of drafting, optimizing, and formatting resumes. It provides users with a professional edge by ensuring their content is high-impact, quantified, and tailored to specific job descriptions.

### 2. Objectives
- To automate the creation of professional resume content using AI.
- To provide real-time ATS (Applicant Tracking System) match scoring.
- To enable instant importing of legacy resumes through AI-driven parsing.
- To ensure all resumes adhere to professional one-page formatting standards.
- To provide a seamless, live-preview editing experience with multiple design templates.

### 3. Proposed System
The proposed system is a production-grade MERN-style application (replacing Mongo with PostgreSQL) that features:
- A dynamic, sidebar-driven resume compiler.
- A direct-integration AI Chatbot for conversational resume tailoring.
- A "Magic Importer" that converts raw text into structured resume sections.
- An ATS Analytics engine that compares resumes against Job Descriptions in real-time.

### 4. Technologies Used
- **Frontend**: Next.js 15, Tailwind CSS (v4), Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL via Supabase with Prisma ORM.
- **AI Engine**: Google Gemini 1.5 Flash (Direct API & SDK).
- **Styling**: Vanilla CSS and Tailwind for a premium "Glassmorphism" aesthetic.

### 5. System Modules
- **User Authentication**: Secure signup/login using JWT and profile management.
- **Resume Compiler**: The core module for real-time editing and live previewing.
- **AI Assistant**: A conversational interface for section-specific improvements and FAANG-level optimization.
- **Magic Parser**: An extraction module that structured raw data into JSON resume fields.
- **ATS Analytics**: A comparison module that provides a match score and improvement suggestions.
- **Export Engine**: A client-side module for high-quality PDF and DOCX generation.

### 6. Database Design
The system uses a relational database schema:
- **User Table**: Stores credentials, social links (GitHub/LinkedIn), and professional profile data.
- **Resume Table**: Stores structured JSON data including summary, experience, projects, skills, and target job descriptions.
- **Relations**: A One-to-Many relationship between Users and Resumes, allowing users to maintain multiple versions for different roles.

### 7. System Architecture
The application follows a **Client-Server Architecture**:
1. **Client Tier**: Next.js frontend handles state management and real-time DOM updates.
2. **AI Tier**: Direct browser-to-API calls to Gemini 1.5 Flash ensure ultra-low latency for chat and parsing.
3. **Server Tier**: Node.js API handles secure data persistence and file exports.
4. **Data Tier**: Supabase (PostgreSQL) provides secure, cloud-hosted relational storage.

### 8. Advantages
- **Speed**: Automates hours of manual writing into minutes of AI-driven optimization.
- **FAANG-Ready**: Content is specifically tuned for top-tier tech company requirements.
- **Accuracy**: Real-time ATS scoring reduces the risk of rejection by automated filters.
- **Aesthetics**: Premium, modern templates ensure a stunning first impression.

### 10. Conclusion
The AI Resume Generator Web Application is a comprehensive solution for modern career development. By combining advanced AI capabilities with a premium user interface, it empowers candidates to present their best professional selves, effectively navigating the complexities of modern hiring processes with confidence and speed.
