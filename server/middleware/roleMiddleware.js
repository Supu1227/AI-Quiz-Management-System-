// Middleware to restrict access based on roles (e.g. 'teacher', 'admin')
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the authenticated user has one of the allowed roles
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`
      });
    }

    // Role check passed, proceed to controller
    next();
  };
};

module.exports = { authorizeRoles };