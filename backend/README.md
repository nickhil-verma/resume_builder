# Node.js Backend - AI Resume Builder

The backend handles user authentication, resume persistence, and specialized AI services.

## 🚀 API Endpoints

### Resumes
- `POST /api/resume`: Create a new resume.
- `GET /api/resume`: List all user resumes.
- `GET /api/resume/count`: Get total resume count.
- `PUT /api/resume/:id`: Update a resume.
- `POST /api/resume/rewrite`: Backend AI rewrite fallback.

### Auth
- `POST /api/auth/register`: User registration.
- `POST /api/auth/login`: User login.
- `GET /api/user/profile`: Get user profile.

## 📁 Project Structure & File Usecases

### `src/controllers/`
Contains the **Business Logic** of the application:
- `authController.js`: Manages user signup, login, and profile fetching.
- `resumeController.js`: Handles CRUD operations for resumes and backend AI fallbacks.
- `downloadController.js`: Manages PDF and DOCX generation using server-side libraries.

### `src/routes/`
The **API Map**. Defines the URL structure and connects incoming HTTP requests to their respective controllers.

### `src/utils/gemini.js`
The **Backend AI Service**. Provides a secondary layer of AI processing for complex tasks and serves as a fallback for the frontend compiler.

### `prisma/schema.prisma`
The **Data Blueprint**. Defines the PostgreSQL database schema, including relations between Users and their Resumes.

### `src/middleware/authMiddleware.js`
The **Security Gatekeeper**. Intercepts incoming requests to verify JWT tokens and attach the `userId` to the request object.

## 🛠️ Setup
1. **Install Dependencies**: `npm install`
2. **Setup Prisma**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. **Environment Variables**: Create a `.env` file with:
   ```env
   DATABASE_URL=your_supabase_url
   GEMINI_API_KEY=your_key_here
   JWT_SECRET=your_secret
   ```
4. **Run Server**: `npm run dev`


