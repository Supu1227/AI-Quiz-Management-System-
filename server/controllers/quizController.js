const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher or Admin only)
const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, duration } = req.body;

    // 1. Validation: check required fields
    if (!title || !category || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, and duration (in minutes)'
      });
    }

    // 2. Create the quiz and automatically attach the logged-in teacher's ID
    const quiz = await Quiz.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category.trim(),
      difficulty: difficulty || 'medium',
      duration: Number(duration),
      teacherId: req.user._id // Taken from the JWT token!
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating quiz'
    });
  }
};

// @desc    Get all quizzes (Filtered by role: Students see published, Teachers see their own, Admins see all)
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      // Students only see published quizzes
      query.published = true;
    } else if (req.user.role === 'teacher') {
      // Teachers see quizzes they created
      query.teacherId = req.user._id;
    }
    // Admins see all quizzes (query remains empty: {})

    const quizzes = await Quiz.find(query)
      .populate('teacherId', 'name email') // Replaces teacherId with teacher's name and email
      .sort({ createdAt: -1 }); // Newest quizzes first

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching quizzes'
    });
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('teacherId', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Students cannot view unpublished quizzes
    if (req.user.role === 'student' && !quiz.published) {
      return res.status(403).json({
        success: false,
        message: 'This quiz is not yet published'
      });
    }

    res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Get single quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching quiz'
    });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Teacher who owns it, or Admin)
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Security Check: Only the teacher who created this quiz (or an Admin) can update it!
    if (quiz.teacherId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only edit your own quizzes'
      });
    }

    // Update fields
    const { title, description, category, difficulty, duration, published } = req.body;
    if (title) quiz.title = title.trim();
    if (description !== undefined) quiz.description = description.trim();
    if (category) quiz.category = category.trim();
    if (difficulty) quiz.difficulty = difficulty;
    if (duration) quiz.duration = Number(duration);
    if (published !== undefined) quiz.published = Boolean(published);

    const updatedQuiz = await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz: updatedQuiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating quiz'
    });
  }
};

// @desc    Delete a quiz & all its associated questions
// @route   DELETE /api/quizzes/:id
// @access  Private (Teacher who owns it, or Admin)
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Security Check: Only the owner teacher or Admin can delete
    if (quiz.teacherId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only delete your own quizzes'
      });
    }

    // 1. Delete all questions belonging to this quiz (clean up database)
    await Question.deleteMany({ quizId: quiz._id });

    // 2. Delete the quiz itself
    await Quiz.findByIdAndDelete(quiz._id);

    res.status(200).json({
      success: true,
      message: 'Quiz and all its questions deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting quiz'
    });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz
};