require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Task.deleteMany({});
  await Notification.deleteMany({});

  // Create demo user
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@tasked.com',
    password: 'demo123456',
    role: 'user'
  });

  const categories = ['Work', 'Personal', 'Health', 'Learning', 'Finance'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'in-progress', 'completed'];

  const tasks = [
    { title: 'Design landing page mockup', description: 'Create wireframes and high-fidelity designs for the new landing page', priority: 'high', status: 'in-progress', category: 'Work', tags: ['design', 'ui'], dueDate: new Date(Date.now() + 2 * 86400000) },
    { title: 'Review pull requests', description: 'Review and merge pending PRs on GitHub', priority: 'medium', status: 'pending', category: 'Work', tags: ['code-review'], dueDate: new Date(Date.now() + 1 * 86400000) },
    { title: 'Weekly team standup notes', description: 'Prepare notes for the weekly standup meeting', priority: 'low', status: 'completed', category: 'Work', tags: ['meetings'], completedAt: new Date(Date.now() - 86400000), dueDate: new Date(Date.now() - 86400000) },
    { title: 'Gym workout - Upper body', description: 'Complete upper body workout routine', priority: 'medium', status: 'pending', category: 'Health', tags: ['fitness'], dueDate: new Date(Date.now() + 1 * 86400000) },
    { title: 'Read "Atomic Habits" Chapter 5', description: 'Continue reading the book on habit formation', priority: 'low', status: 'in-progress', category: 'Learning', tags: ['reading', 'self-improvement'], dueDate: new Date(Date.now() + 5 * 86400000) },
    { title: 'Update monthly budget spreadsheet', description: 'Track expenses and income for this month', priority: 'high', status: 'pending', category: 'Finance', tags: ['budgeting'], dueDate: new Date(Date.now() + 3 * 86400000) },
    { title: 'Fix authentication bug', description: 'Debug and fix the JWT token refresh issue', priority: 'high', status: 'completed', category: 'Work', tags: ['bug', 'auth'], completedAt: new Date(Date.now() - 2 * 86400000), dueDate: new Date(Date.now() - 3 * 86400000) },
    { title: 'Grocery shopping', description: 'Buy weekly groceries from the store', priority: 'medium', status: 'pending', category: 'Personal', tags: ['errands'], dueDate: new Date(Date.now() + 1 * 86400000) },
    { title: 'Learn TypeScript generics', description: 'Complete TypeScript advanced generics tutorial', priority: 'medium', status: 'in-progress', category: 'Learning', tags: ['typescript', 'programming'], dueDate: new Date(Date.now() + 7 * 86400000) },
    { title: 'Prepare quarterly report', description: 'Compile data and create the Q2 report presentation', priority: 'high', status: 'pending', category: 'Work', tags: ['reporting', 'presentation'], dueDate: new Date(Date.now() - 1 * 86400000) },
    { title: 'Meditate for 20 minutes', description: 'Morning meditation session', priority: 'low', status: 'completed', category: 'Health', tags: ['wellness'], completedAt: new Date(Date.now() - 1 * 86400000) },
    { title: 'Deploy staging environment', description: 'Push latest changes to staging server', priority: 'high', status: 'completed', category: 'Work', tags: ['devops', 'deployment'], completedAt: new Date(Date.now() - 4 * 86400000), dueDate: new Date(Date.now() - 5 * 86400000) },
    { title: 'Plan weekend trip', description: 'Research destinations and book accommodation', priority: 'low', status: 'pending', category: 'Personal', tags: ['travel'], dueDate: new Date(Date.now() + 10 * 86400000) },
    { title: 'Database optimization', description: 'Add indexes and optimize slow queries', priority: 'medium', status: 'in-progress', category: 'Work', tags: ['database', 'performance'], dueDate: new Date(Date.now() + 4 * 86400000) },
    { title: 'Write blog post on React patterns', description: 'Draft a technical blog post about advanced React patterns', priority: 'medium', status: 'pending', category: 'Learning', tags: ['writing', 'react'], dueDate: new Date(Date.now() + 6 * 86400000) },
  ];

  for (const taskData of tasks) {
    await Task.create({ ...taskData, userId: user._id });
  }

  console.log('Seed data created successfully!');
  console.log('Demo credentials: demo@tasked.com / demo123456');
  process.exit(0);
};

seedData().catch(err => {
  console.error(err);
  process.exit(1);
});
