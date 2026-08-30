const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load secret settings from .env
dotenv.config();

// 2. Connect to MongoDB database
connectDB();

// 3. Initialize Express application
const app = express();

// 4. Middlewares
app.use(cors());
app.use(express.json());

// 5. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/quizzes/:quizId/questions', require('./routes/questionRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes')); // AI Generation Routes!

// Health Check / Test Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI Quiz Management System API is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

// 6. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 8. Start listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});