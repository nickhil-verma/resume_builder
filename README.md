# AI Resume Builder & Compiler

A production-grade, AI-powered resume platform designed to help users build FAANG-ready, one-page resumes. This platform leverages Google's Gemini 1.5 Flash to provide intelligent content suggestions, ATS analysis, and automated resume parsing.

## 🚀 Key Features

- **AI Resume Compiler**: Real-time editing with live high-fidelity preview.
- **FAANG-Optimized**: AI suggestions tuned for big tech giants and high-impact roles.
- **Magic Importer**: Instantly parse legacy resumes (PDF/Text) into structured data.
- **ATS Analytics**: Real-time match scoring against job descriptions.
- **Multi-Template Support**: Modern, Classic, and Minimal visual styles.
- **One-Page Constraint**: Intelligent content pruning to ensure your resume fits on a single page.

## 🏗️ Architecture

The project is split into two main parts:

1. **Frontend**: Built with **Next.js 15**, **Tailwind CSS**, and **Framer Motion**. It communicates directly with Gemini AI for low-latency chat and uses a Node.js backend for data persistence.
2. **Backend**: A robust **Node.js/Express** server using **Prisma** with **Supabase (PostgreSQL)** for secure data management and PDF/Docx generation.

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Lucide React, Framer Motion, Axios.
- **Backend**: Node.js, Express, Prisma, Supabase, JWT Authentication.
- **AI**: Google Gemini 1.5 Flash (via direct API & SDK).

## 🚦 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd Resume_Builder
```

### 2. Setup Backend
```bash
cd backend
npm install
# Configure .env with your DATABASE_URL and GEMINI_API_KEY
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# Configure .env with NEXT_PUBLIC_GEMINI_API_KEY
npm run dev
```

## 📄 License
MIT License
