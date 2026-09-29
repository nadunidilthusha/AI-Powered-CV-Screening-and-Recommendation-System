const express = require('express');
const {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  updateApiConfig,
  getApiConfig,
  getSystemStatus,
  getDatabaseStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Every route here requires a logged-in admin.
router.use(protect, allowRoles('admin'));

router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUserRole)
  .delete(deleteUser);

router.route('/api-config')
  .get(getApiConfig)
  .put(updateApiConfig);

router.get('/system-status', getSystemStatus);
router.get('/database-status', getDatabaseStatus);

module.exports = router;