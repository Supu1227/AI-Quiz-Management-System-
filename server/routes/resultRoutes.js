const express = require('express');
const router = express.Router();

const {
  getResults,
  getResultById,
  getTeacherStats
} = require('../controllers/resultController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All result routes require login
router.use(protect);

// GET /api/results/teacher/stats (Teacher performance statistics)
router.get('/teacher/stats', authorizeRoles('teacher', 'admin'), getTeacherStats);

// GET /api/results (Students see their results, Admins see all)
router.get('/', getResults);

// GET /api/results/:id (Single result details)
router.get('/:id', getResultById);

module.exports = router;