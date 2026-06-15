const mongoose = require('mongoose');
const Task = require('../models/Task');

// GET /api/analytics/overview
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, completed, pending, inProgress, overdue] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'completed' }),
      Task.countDocuments({ userId, status: 'pending' }),
      Task.countDocuments({ userId, status: 'in-progress' }),
      Task.countDocuments({ userId, status: { $ne: 'completed' }, dueDate: { $lt: now, $ne: null } })
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/analytics/productivity
exports.getProductivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completedTasks = await Task.find({
      userId,
      status: 'completed',
      completedAt: { $gte: thirtyDaysAgo }
    }).select('completedAt createdAt');

    // Group by day
    const dailyData = {};
    const weeklyData = {};

    completedTasks.forEach(task => {
      const day = task.completedAt.toISOString().split('T')[0];
      dailyData[day] = (dailyData[day] || 0) + 1;

      const weekDay = task.completedAt.toLocaleDateString('en-US', { weekday: 'long' });
      weeklyData[weekDay] = (weeklyData[weekDay] || 0) + 1;
    });

    // Productivity over time (last 30 days)
    const productivityTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      productivityTrend.push({
        date: key,
        completed: dailyData[key] || 0
      });
    }

    // Most productive day
    let mostProductiveDay = 'N/A';
    let maxCompleted = 0;
    Object.entries(weeklyData).forEach(([day, count]) => {
      if (count > maxCompleted) {
        maxCompleted = count;
        mostProductiveDay = day;
      }
    });

    // Average completion time
    let totalCompletionTime = 0;
    let completedWithTime = 0;
    completedTasks.forEach(task => {
      if (task.createdAt && task.completedAt) {
        totalCompletionTime += (task.completedAt - task.createdAt);
        completedWithTime++;
      }
    });
    const avgCompletionHours = completedWithTime > 0
      ? Math.round((totalCompletionTime / completedWithTime) / (1000 * 60 * 60))
      : 0;

    // Weekly activity
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyActivity = days.map(day => ({
      day: day.slice(0, 3),
      tasks: weeklyData[day] || 0
    }));

    res.json({
      productivityTrend,
      mostProductiveDay,
      avgCompletionHours,
      weeklyActivity,
      totalCompleted: completedTasks.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/analytics/status
exports.getStatusBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [statusData, priorityData, categoryData] = await Promise.all([
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      byStatus: statusData.map(d => ({ name: d._id, value: d.count })),
      byPriority: priorityData.map(d => ({ name: d._id, value: d.count })),
      byCategory: categoryData.map(d => ({ name: d._id || 'General', value: d.count }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
