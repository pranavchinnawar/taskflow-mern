const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // If admin, can see all tasks, else only assigned tasks
    const query = req.user.role === 'Admin' ? {} : { assignedUser: req.user._id };
    
    // Allow filtering by project
    if (req.query.projectId) {
      query.project = req.query.projectId;
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedUser', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedUser', 'name email');

    if (task) {
      // Check access
      if (req.user.role !== 'Admin' && task.assignedUser._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this task' });
      }
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignedUser } = req.body;

  try {
    const task = new Task({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      project,
      assignedUser,
    });

    const createdTask = await task.save();
    
    // Populate for immediate return
    const populatedTask = await Task.findById(createdTask._id)
      .populate('project', 'name')
      .populate('assignedUser', 'name email');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedUser } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      // If employee, can only update status
      if (req.user.role !== 'Admin') {
        if (task.assignedUser.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to update this task' });
        }
        if (status) task.status = status;
      } else {
        // Admin can update all fields
        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;
        if (assignedUser) task.assignedUser = assignedUser;
      }

      const updatedTask = await task.save();
      
      const populatedTask = await Task.findById(updatedTask._id)
        .populate('project', 'name')
        .populate('assignedUser', 'name email');
        
      res.json(populatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
