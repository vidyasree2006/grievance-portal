const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getGrievances,
  getGrievance,
  updateStatus,
  deleteGrievance
} = require('../controllers/grievanceController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Student creates grievance, all roles can view
router.post('/', authorize('student'), createGrievance);
router.get('/', getGrievances);
router.get('/:id', getGrievance);

// HOD and Admin update status
router.put('/:id/status', authorize('hod', 'admin'), updateStatus);

// Admin only delete
router.delete('/:id', authorize('admin'), deleteGrievance);

module.exports = router;