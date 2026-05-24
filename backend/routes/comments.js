const express = require('express');
const router = express.Router();
const {
  getCommentsByTask,
  addComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addComment);

router.route('/task/:taskId')
  .get(protect, getCommentsByTask);

module.exports = router;
