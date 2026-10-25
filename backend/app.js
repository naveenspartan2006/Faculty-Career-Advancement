const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const conferenceRoutes = require('./routes/conferenceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Faculty Career Advancement & Publication Summary Generator API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/admin', adminRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
