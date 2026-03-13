// database connection to MongoDB Atlas, Supabase Postgres, and Redis (e.g. Upstash)
import mongoose from 'mongoose';
import pg from 'pg';
import Redis from 'ioredis';

const { Pool } = pg;

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/econexus_carbon';
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const pgPool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: process.env.DATABASE_URL.includes('supabase') ? { rejectUnauthorized: false } : undefined,
      }
    : {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || 'econexus_commerce',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'password',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

pgPool.on('connect', () => {
  console.log('PostgreSQL Connected');
});

// Only create Redis client when REDIS_URL is set (e.g. Upstash on Render). Otherwise rate limiting uses in-memory store.
const redisClient = process.env.REDIS_URL
  ? (() => {
      const client = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, retryStrategy: (times) => Math.min(times * 100, 3000) });
      client.on('connect', () => console.log('Redis Connected'));
      client.on('error', (err) => console.warn('Redis:', err.message));
      return client;
    })()
  : null;

export { connectMongoDB, pgPool, redisClient, mongoose };
