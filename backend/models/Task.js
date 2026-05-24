const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Done'],
    default: 'Todo',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date'],
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Task must belong to a project'],
  },
  assignedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
