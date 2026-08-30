
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// @desc    Add a question to a quiz
// @route   POST /api/quizzes/:quizId/questions
// @access  Private (Teacher or Admin)
const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    // 1. Check if the quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // 2. Ownership check: Only the teacher who created the quiz (or admin) can add questions
    if (quiz.teacherId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only add questions to your own quizzes'
      });
    }

    // 3. Validation: question text
    if (!questionText || questionText.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Question text is required'
      });
    }

    // 4. Validation: exactly 4 options
    if (!options || !Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'A question must have exactly 4 options'
      });
    }

    // Check that no option is empty
    const hasEmptyOption = options.some(opt => !opt || opt.trim() === '');
    if (hasEmptyOption) {
      return res.status(400).json({
        success: false,
        message: 'All 4 options must be filled out'
      });
    }

    // 5. Validation: correct answer index (must be 0, 1, 2, or 3)
    if (correctAnswer === undefined || correctAnswer < 0 || correctAnswer > 3) {
      return res.status(400).json({
        success: false,
        message: 'correctAnswer must be an index: 0, 1, 2, or 3'
      });
    }

    // 6. Save question into MongoDB
    const question = await Question.create({
      quizId,
      questionText: questionText.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswer: Number(correctAnswer)
    });

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      question
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding question'
    });
  }
};

// @desc    Get all questions for a quiz
// @route   GET /api/quizzes/:quizId/questions
// @access  Private
const getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Security Feature:
    // If student: HIDE the correct answer so they cannot inspect and cheat!
    // If teacher/admin: SHOW the correct answer so they can review it!
    let query = Question.find({ quizId });

    if (req.user.role === 'student') {
      query = query.select('-correctAnswer');
    }

    const questions = await query.sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching questions'
    });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private (Teacher or Admin)
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Verify teacher owns the parent quiz
    const quiz = await Quiz.findById(question.quizId);
    if (quiz.teacherId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only edit questions for your own quizzes'
      });
    }

    const { questionText, options, correctAnswer } = req.body;
    if (questionText) question.questionText = questionText.trim();
    if (options && Array.isArray(options) && options.length === 4) {
      question.options = options.map(opt => opt.trim());
    }
    if (correctAnswer !== undefined && correctAnswer >= 0 && correctAnswer <= 3) {
      question.correctAnswer = Number(correctAnswer);
    }

    const updatedQuestion = await question.save();

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating question'
    });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private (Teacher or Admin)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Verify teacher owns the parent quiz
    const quiz = await Quiz.findById(question.quizId);
    if (quiz.teacherId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only delete questions from your own quizzes'
      });
    }

    await Question.findByIdAndDelete(question._id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting question'
    });
  }
};

module.exports = {
  addQuestion,
  getQuestionsByQuiz,
  updateQuestion,
  deleteQuestion
};