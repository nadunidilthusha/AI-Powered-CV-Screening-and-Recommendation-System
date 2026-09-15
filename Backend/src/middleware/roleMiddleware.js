const ApiError = require('../utils/ApiError');

/**
 * Restricts a route to specific roles. Must run AFTER `protect`, since
 * it relies on req.user already being set. Backend equivalent of the
 * frontend's RoleRoute component.
 *
 * Usage:
 *   router.get('/admin/users', protect, allowRoles('admin'), getUsers);
 */
const allowRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role '${req.user.role}' is not permitted to access this resource`);
    }
    next();
  };

module.exports = { allowRoles };
