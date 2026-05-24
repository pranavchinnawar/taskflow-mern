const Comment = require('../models/Comment');
const Task = require('../models/Task');

// @desc    Get comments for a task
// @route   GET /api/comments/task/:taskId
// @access  Private
const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name role')
      .sort({ createdAt: 1 });
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a task
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  const { text, taskId } = req.body;

  try {
    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = new Comment({
      text,
      task: taskId,
      user: req.user._id,
    });

    const createdComment = await comment.save();
    
    // Populate user before returning
    const populatedComment = await Comment.findById(createdComment._id)
      .populate('user', 'name role');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentsByTask,
  addComment,
};
