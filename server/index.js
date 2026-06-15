require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const setupSocket = require('./sockets/taskSocket');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Store io instance
app.set('io', io);

// Socket setup
setupSocket(io);

const User = require('./models/User');
const Task = require('./models/Task');
const Notification = require('./models/Notification');

// Connect DB and Start Server
connectDB().then(async () => {
  // Seed demo data if empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@tasked.com',
      password: 'demo123456',
      role: 'user'
    });
    
    const tasks = [
      { title: 'Design landing page mockup', description: 'Create wireframes and high-fidelity designs for the new landing page', priority: 'high', status: 'in-progress', category: 'Work', tags: ['design', 'ui'], dueDate: new Date(Date.now() + 2 * 86400000) },
      { title: 'Review pull requests', description: 'Review and merge pending PRs on GitHub', priority: 'medium', status: 'pending', category: 'Work', tags: ['code-review'], dueDate: new Date(Date.now() + 1 * 86400000) },
      { title: 'Weekly team standup notes', description: 'Prepare notes for the weekly standup meeting', priority: 'low', status: 'completed', category: 'Work', tags: ['meetings'], completedAt: new Date(Date.now() - 86400000), dueDate: new Date(Date.now() - 86400000) },
      { title: 'Gym workout - Upper body', description: 'Complete upper body workout routine', priority: 'medium', status: 'pending', category: 'Health', tags: ['fitness'], dueDate: new Date(Date.now() + 1 * 86400000) }
    ];
    
    for (const taskData of tasks) {
      await Task.create({ ...taskData, userId: user._id });
    }
    console.log('Seeded in-memory DB with Demo User.');
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(mongoSanitize());
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});
