const Comment = require('../models/Comment');
const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');

// @POST /api/v1/comments/:grievanceId — add comment
exports.addComment = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    const comment = await Comment.create({
      grievance: req.params.grievanceId,
      author: req.user.userId,
      text: req.body.text
    });

    // Notify student if comment is from HOD/Admin
    if (req.user.role !== 'student') {
      await Notification.create({
        recipient: grievance.student,
        message: `New reply on your grievance "${grievance.title}"`,
        grievance: grievance._id
      });
    }

    const populated = await comment.populate('author', 'name role');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @GET /api/v1/comments/:grievanceId — get all comments
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ grievance: req.params.grievanceId })
      .populate('author', 'name role department')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/v1/comments/:id — delete own comment
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only author or admin can delete
    if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};