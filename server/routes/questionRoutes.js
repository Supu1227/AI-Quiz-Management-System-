const express = require('express');
// mergeParams: true allows us to access :quizId from the parent route
const router = express.Router({ mergeParams: true });

// Import controller functions
const {
  addQuestion,
  getQuestionsByQuiz,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');

// Import security middlewares
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All question routes require authentication
router.use(protect);

// Routes for: /api/quizzes/:quizId/questions
router
  .route('/')
  .get(getQuestionsByQuiz)
  .post(authorizeRoles('teacher', 'admin'), addQuestion);

// Routes for: /api/questions/:id
router
  .route('/:id')
  .put(authorizeRoles('teacher', 'admin'), updateQuestion)
  .delete(authorizeRoles('teacher', 'admin'), deleteQuestion);

module.exports = router;