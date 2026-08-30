const mongoose = require('mongoose');

// Blueprint for Quizzes created by teachers
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a quiz title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links this quiz to the User collection
      required: [true, 'A quiz must belong to a teacher']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category (e.g. Science, Tech, Math)'],
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    duration: {
      type: Number,
      required: [true, 'Please specify quiz duration in minutes'],
      min: [1, 'Duration must be at least 1 minute']
    },
    published: {
      type: Boolean,
      default: false // Only published quizzes will be visible to students
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quiz', quizSchema);