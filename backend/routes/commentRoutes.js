const express = require('express');
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/:grievanceId', addComment);
router.get('/:grievanceId', getComments);
router.delete('/:id', deleteComment);

module.exports = router;