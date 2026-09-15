const express = require('express');
const {
  getUsers,
  updateApiConfig,
  getSystemStatus,
  getDatabaseStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Every route here requires a logged-in admin — matches the frontend's
// AdminLayout / RoleRoute gating.
router.use(protect, allowRoles('admin'));

router.get('/users', getUsers);
router.put('/api-config', updateApiConfig);
router.get('/system-status', getSystemStatus);
router.get('/database-status', getDatabaseStatus);

module.exports = router;
