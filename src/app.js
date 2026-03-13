// Main application file for the EcoFriendly API, setting up Express server, middleware, routes, and initializing database connections and background jobs.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');
const RedisStore = require('rate-limit-redis');

const config = require('./config/environment');
const { connectMongoDB, redisClient } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { setupWebSocket } = require('./websocket');
const { setupJobs } = require('./jobs');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Stricter limits for carbon calculations
const carbonLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 60 * 1000,
  max: 30
});
app.use('/api/carbon/', carbonLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

// API routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize connections and services
async function initialize() {
  // Connect to MongoDB
  await connectMongoDB();
  
  // Setup PostgreSQL tables if needed
  await setupPostgresTables();
  
  // Start background jobs
  setupJobs();
  
  console.log('Services initialized');
}

async function setupPostgresTables() {
  const { pgPool } = require('./config/database');
  const fs = require('fs');
  const path = require('path');
  
  const schemaSQL = fs.readFileSync(
    path.join(__dirname, 'models/postgres/schema.sql'),
    'utf8'
  );
  
  try {
    await pgPool.query(schemaSQL);
    console.log('PostgreSQL tables verified');
  } catch (error) {
    console.error('PostgreSQL setup error:', error.message);
  }
}

// Graceful shutdown haha
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  const { pgPool } = require('./config/database');
  await pgPool.end();
  process.exit(0);
});

module.exports = { app, initialize };