// database connection to mongodb, postgresql, atlas
const mongoose = require('mongoose');
const { Pool } = require('pg');
const Redis = require('ioredis');

// MongoDB Connection (Primary - Carbon/Analytics Data)
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/senken_carbon', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// PostgreSQL Connection (Commerce/Finance Data)
const pgPool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'senken_commerce',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.on('connect', () => {
  console.log('PostgreSQL Connected');
});

// Redis Connection (Caching/Session)
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisClient.on('connect', () => {
  console.log('Redis Connected');
});

module.exports = {
  connectMongoDB,
  pgPool,
  redisClient,
  mongoose
};