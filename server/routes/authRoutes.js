const express = require('express');
const router = express.Router();

// Import controller functions
const { register, login, getMe } = require('../controllers/authController');

// Import authentication security guard
const { protect } = require('../middleware/authMiddleware');

// Public routes (anyone can access)
router.post('/register', register);
router.post('/login', login);

// Private route (requires valid JWT token)
router.get('/me', protect, getMe);

module.exports = router;