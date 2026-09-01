const User = require('../models/User');
const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');

// @GET /api/v1/admin/stats — dashboard analytics
exports.getStats = async (req, res, next) => {
  try {
    const totalGrievances = await Grievance.countDocuments();
    const pending = await Grievance.countDocuments({ status: 'pending' });
    const inProgress = await Grievance.countDocuments({ status: 'in_progress' });
    const resolved = await Grievance.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments({ role: 'student' });

    // Grievances by category
    const byCategory = await Grievance.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Grievances by department
    const byDepartment = await Grievance.aggregate([
      { $lookup: { from: 'users', localField: 'student', foreignField: '_id', as: 'studentData' } },
      { $unwind: '$studentData' },
      { $group: { _id: '$studentData.department', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalGrievances,
        pending,
        inProgress,
        resolved,
        totalUsers,
        byCategory,
        byDepartment
      }
    });
  } catch (err) {
    next(err);
  }
};

// @GET /api/v1/admin/users — get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/v1/admin/users/:id — update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/v1/admin/users/:id — delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// @GET /api/v1/admin/notifications — get all notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.userId })
      .populate('grievance', 'title status')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};