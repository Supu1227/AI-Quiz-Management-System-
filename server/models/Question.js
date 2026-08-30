const mongoose = require('mongoose');

// Blueprint for Multiple-Choice Questions
const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz', // Links this question to its quiz
      required: [true, 'A question must belong to a quiz']
    },
    questionText: {
      type: String,
      required: [true, 'Please provide the question text'],
      trim: true
    },
    options: {
      type: [String],
      validate: {
        // Custom validator ensuring exactly 4 non-empty choices
        validator: function (val) {
          return Array.isArray(val) && val.length === 4 && val.every(opt => opt && opt.trim().length > 0);
        },
        message: 'A question must have exactly 4 non-empty options'
      },
      required: true
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Please specify the correct answer index (0, 1, 2, or 3)'],
      min: [0, 'Index must be between 0 and 3'],
      max: [3, 'Index must be between 0 and 3']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Question', questionSchema);