const express = require('express');
const router = express.Router();

const { generateQuestions } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Only logged in Teachers and Admins can generate AI questions
router.use(protect);
router.use(authorizeRoles('teacher', 'admin'));

// POST /api/ai/generate
router.post('/generate', generateQuestions);

module.exports = router;