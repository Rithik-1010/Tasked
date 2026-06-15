const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { search, status, priority, category, sort, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'dueDate') sortObj = { dueDate: 1 };
    if (sort === 'priority') sortObj = { priority: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query).sort(sortObj).skip(skip).limit(parseInt(limit));

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const task = await Task.create({ ...req.body, userId: req.user._id });

    await Notification.create({
      userId: req.user._id,
      message: `Task "${task.title}" created`,
      type: 'task_created',
      taskId: task._id
    });

    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task:created', task);
      io.to(req.user._id.toString()).emit('notification', { message: `Task "${task.title}" created`, type: 'task_created' });
    }

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }
    if (req.body.status && req.body.status !== 'completed') {
      req.body.completedAt = null;
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (req.body.status === 'completed') {
      await Notification.create({
        userId: req.user._id,
        message: `Task "${task.title}" completed!`,
        type: 'task_completed',
        taskId: task._id
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task:updated', task);
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task:deleted', req.params.id);
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/tasks/bulk
exports.bulkAction = async (req, res) => {
  try {
    const { taskIds, action, data } = req.body;
    if (!taskIds || !Array.isArray(taskIds) || !action) {
      return res.status(400).json({ message: 'taskIds array and action required' });
    }

    let result;
    const filter = { _id: { $in: taskIds }, userId: req.user._id };

    if (action === 'delete') {
      result = await Task.deleteMany(filter);
    } else if (action === 'update') {
      const updateData = { ...data };
      if (data && data.status === 'completed') {
        updateData.completedAt = new Date();
      }
      result = await Task.updateMany(filter, updateData);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('tasks:bulk-update');
    }

    res.json({ message: `Bulk ${action} completed`, result });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
