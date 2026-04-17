require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./utils/db');
const { initializeDatabase } = require('./models');
const rateLimiter = require('./middleware/rateLimiter');

const required = ['MONGODB_URI', 'JWT_SECRET'];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting (needed for production behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5174'
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting middleware
app.use('/api/auth', rateLimiter({ windowMs: 15 * 60 * 1000, max: 50 })); // 50 requests per 15 minutes for auth
app.use('/api/transactions', rateLimiter({ windowMs: 15 * 60 * 1000, max: 200 })); // 200 requests per 15 minutes
app.use('/api/upload', rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 uploads per 15 minutes
app.use('/api/goals', rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/budgets', rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/reports', rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/leaks', require('./routes/leakDetection'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handler
app.use(require('./middleware/errorHandler'));

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize database (create collections and indexes)
    await initializeDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
