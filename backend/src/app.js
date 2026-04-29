const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const jobRoutes = require('./routes/jobRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/projects', projectRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AI Resume Generator API is running' });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
