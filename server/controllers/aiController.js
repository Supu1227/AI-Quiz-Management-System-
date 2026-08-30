const { generateMCQs } = require('../services/aiService');

// @desc    Generate MCQs from a topic or teacher study notes using AI
// @route   POST /api/ai/generate
// @access  Private (Teacher or Admin only)
const generateQuestions = async (req, res) => {
  try {
    const { topic, notes, numQuestions, difficulty } = req.body;

    // 1. Validation: Teacher must provide either a Topic OR Study Notes
    if ((!topic || topic.trim() === '') && (!notes || notes.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a topic or study notes for the AI'
      });
    }

    // 2. Call AI Service
    const questions = await generateMCQs({
      topic,
      notes,
      numQuestions: numQuestions || 5,
      difficulty: difficulty || 'medium'
    });

    // 3. Return structured questions for the teacher to review
    res.status(200).json({
      success: true,
      message: 'AI questions generated successfully. Review before adding to quiz.',
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during AI question generation'
    });
  }
};

module.exports = { generateQuestions };