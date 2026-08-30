const express = require('express');
const router = express.Router();

// Import quiz controllers
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');

// Import submission & leaderboard controllers
const { submitQuiz, getLeaderboard } = require('../controllers/resultController');

// Import security middlewares
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All quiz routes require authentication
router.use(protect);

// Quiz submission endpoint (Students & Admins)
router.post('/:quizId/submit', authorizeRoles('student', 'admin'), submitQuiz);

// Quiz leaderboard endpoint (All authenticated users)
router.get('/:quizId/leaderboard', getLeaderboard);

// Quiz CRUD routes
router
  .route('/')
  .get(getQuizzes)
  .post(authorizeRoles('teacher', 'admin'), createQuiz);

router
  .route('/:id')
  .get(getQuizById)
  .put(authorizeRoles('teacher', 'admin'), updateQuiz)
  .delete(authorizeRoles('teacher', 'admin'), deleteQuiz);

module.exports = router;