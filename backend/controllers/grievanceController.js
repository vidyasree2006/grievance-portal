const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');

// @POST /api/v1/grievances — student creates grievance
exports.createGrievance = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    const grievance = await Grievance.create({
      title,
      description,
      category,
      priority,
      student: req.user.userId,
      statusHistory: [{
        status: 'pending',
        changedBy: req.user.userId,
        note: 'Grievance submitted'
      }]
    });

    res.status(201).json({ success: true, data: grievance });
  } catch (err) {
    next(err);
  }
};

// @GET /api/v1/grievances — get grievances based on role
exports.getGrievances = async (req, res, next) => {
  try {
    let query = {};

    // Students only see their own
    if (req.user.role === 'student') {
      query.student = req.user.userId;
    }

    // Filter by status if provided
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.priority) query.priority = req.query.priority;

    const grievances = await Grievance.find(query)
      .populate('student', 'name email department rollNumber')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: grievances.length, data: grievances });
  } catch (err) {
    next(err);
  }
};

// @GET /api/v1/grievances/:id — get single grievance
exports.getGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('student', 'name email department rollNumber')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name role');

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    res.json({ success: true, data: grievance });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/v1/grievances/:id/status — HOD/Admin updates status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    // Update status
    grievance.status = status;
    grievance.statusHistory.push({
      status,
      changedBy: req.user.userId,
      note: note || `Status updated to ${status}`
    });

    await grievance.save();

    // Create notification for student
    await Notification.create({
      recipient: grievance.student,
      message: `Your grievance "${grievance.title}" status updated to ${status}`,
      grievance: grievance._id
    });

    res.json({ success: true, data: grievance });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/v1/grievances/:id — Admin only
exports.deleteGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findByIdAndDelete(req.params.id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }
    res.json({ success: true, message: 'Grievance deleted' });
  } catch (err) {
    next(err);
  }
};