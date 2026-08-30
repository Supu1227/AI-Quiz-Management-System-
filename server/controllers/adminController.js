const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// @desc    Get system-wide metrics and stats for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Result.countDocuments();

    // Calculate overall average score
    const allResults = await Result.find();
    const avgScore = totalAttempts > 0
      ? Math.round(allResults.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalQuizzes,
        totalAttempts,
        averageScore: avgScore
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching admin stats'
    });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching users'
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers
};