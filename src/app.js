// Main application file for the EcoFriendly API, setting up Express server, middleware, routes, and initializing database connections and background jobs.
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/environment.js';
import { connectMongoDB, redisClient, pgPool } from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import { setupJobs } from './jobs/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pgPool.end();
  process.exit(0);
});

export { app, initialize };