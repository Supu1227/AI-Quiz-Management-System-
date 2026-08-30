const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Submit quiz answers and calculate score on backend
// @route   POST /api/quizzes/:quizId/submit
// @access  Private (Student or Admin)
const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of { questionId, selectedOption }

    // 1. Verify quiz exists and is published
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!quiz.published && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Cannot submit an unpublished quiz'
      });
    }

    // 2. Fetch all real questions for this quiz from MongoDB
    const questions = await Question.find({ quizId });
    if (!questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This quiz has no questions'
      });
    }

    // 3. Backend Score Calculation
    let score = 0;
    const details = [];

    // Map answers by questionId for fast lookup
    const answerMap = {};
    if (Array.isArray(answers)) {
      answers.forEach(ans => {
        answerMap[ans.questionId] = ans.selectedOption;
      });
    }

    // Compare each question with the student's submission
    questions.forEach(q => {
      const selected = answerMap[q._id.toString()];
      const isCorrect = selected !== undefined && Number(selected) === q.correctAnswer;

      if (isCorrect) {
        score++;
      }

      details.push({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        selectedOption: selected !== undefined ? Number(selected) : null,
        correctAnswer: q.correctAnswer,
        isCorrect
      });
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // 4. Save result into MongoDB
    const result = await Result.create({
      studentId: req.user._id,
      quizId,
      score,
      totalQuestions,
      percentage
    });

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      result,
      details
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting quiz'
    });
  }
};

// @desc    Get logged in student's past results
// @route   GET /api/results
// @access  Private
const getResults = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      // Students only see their own results
      query.studentId = req.user._id;
    }
    // Admins see all results

    const results = await Result.find(query)
      .populate('quizId', 'title category difficulty duration')
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching results'
    });
  }
};

// @desc    Get single result details
// @route   GET /api/results/:id
// @access  Private
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId', 'title category difficulty duration')
      .populate('studentId', 'name email');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Security: Students can only view their own result
    if (req.user.role === 'student' && result.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view another student’s result'
      });
    }

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Get single result error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching result'
    });
  }
};

// @desc    Get leaderboard for a specific quiz
// @route   GET /api/quizzes/:quizId/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Fetch top results sorted by highest score, then by earliest submission time
    const leaderboard = await Result.find({ quizId })
      .populate('studentId', 'name email')
      .sort({ score: -1, createdAt: 1 })
      .limit(10); // Top 10 ranks

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching leaderboard'
    });
  }
};

// @desc    Get performance stats for a teacher's quizzes
// @route   GET /api/results/teacher/stats
// @access  Private (Teacher or Admin)
const getTeacherStats = async (req, res) => {
  try {
    // 1. Find all quizzes created by this teacher
    const quizzes = await Quiz.find({ teacherId: req.user._id });
    const quizIds = quizzes.map(q => q._id);

    // 2. Find all results submitted for these quizzes
    const results = await Result.find({ quizId: { $in: quizIds } })
      .populate('quizId', 'title')
      .populate('studentId', 'name email');

    const totalAttempts = results.length;
    const averageScore = totalAttempts > 0
      ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalQuizzes: quizzes.length,
        totalAttempts,
        averageScore
      },
      results
    });
  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching teacher stats'
    });
  }
};

module.exports = {
  submitQuiz,
  getResults,
  getResultById,
  getLeaderboard,
  getTeacherStats
};