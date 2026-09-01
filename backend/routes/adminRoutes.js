const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getNotifications
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes protected
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/notifications', getNotifications);

module.exports = router;