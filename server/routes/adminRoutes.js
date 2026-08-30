const express = require('express');
const router = express.Router();

const { getAdminStats, getAllUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All admin routes require login AND admin role
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);

module.exports = router;