const mongoose = require('mongoose');

// Blueprint for Quiz Results and Scores
const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the student who took the quiz
      required: [true, 'A result must belong to a student']
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz', // Links to the quiz that was attempted
      required: [true, 'A result must be associated with a quiz']
    },
    score: {
      type: Number,
      required: [true, 'Please provide the obtained score'],
      min: 0
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Please provide total number of questions'],
      min: 1
    },
    percentage: {
      type: Number,
      required: [true, 'Please provide calculated percentage'],
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true // Automatically tracks when the quiz was submitted
  }
);

module.exports = mongoose.model('Result', resultSchema);