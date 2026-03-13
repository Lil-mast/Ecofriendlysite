// background jobs for data aggregation, reporting, and ML tasks

const cron = require('node-cron');
const { CarbonEntry } = require('../models/mongodb');
const { pgPool } = require('../config/database');
const ReportingService = require('../services/analytics/Reporting');
const MLPrediction = require('../services/ai/MLPrediction');

function setupJobs() {
  // Daily aggregation job - runs at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('Running daily aggregation...');
    await runDailyAggregation();
  });
  
  // Weekly reports - Mondays at 9 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('Generating weekly reports...');
    await generateWeeklyReports();
  });
  
  // Monthly AI model retraining - 1st of month at 3 AM
  cron.schedule('0 3 1 * *', async () => {
    console.log('Retraining ML models...');
    await retrainModels();
  });
  
  // Auction finalization check - every minute
  cron.schedule('* * * * *', async () => {
    await checkEndingAuctions();
  });
  
  console.log('Background jobs scheduled');
}

async function runDailyAggregation() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date(yesterday);
  today.setDate(today.getDate() + 1);
  
  // Aggregate daily stats per user
  const stats = await CarbonEntry.aggregate([
    {
      $match: {
        date: { $gte: yesterday, $lt: today }
      }
    },
    {
      $group: {
        _id: '$userId',
        totalEmissions: { $sum: '$emissions.totalCo2e' },
        entryCount: { $sum: 1 },
        categories: { $addToSet: '$category' }
      }
    }
  ]);
  
  // Store in analytics table
  for (const stat of stats) {
    await pgPool.query(
      `INSERT INTO daily_stats (user_id, date, total_emissions, entry_count, categories)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, date) DO UPDATE SET
       total_emissions = $3, entry_count = $4, categories = $5`,
      [stat._id, yesterday, stat.totalEmissions, stat.entryCount, stat.categories]
    );
  }
  
  console.log(`Aggregated ${stats.length} user stats`);
}

async function generateWeeklyReports() {
  // Get all active users
  const users = await pgPool.query(
    'SELECT mongo_id FROM users WHERE created_at < NOW() - INTERVAL \'7 days\''
  );
  
  for (const user of users.rows) {
    try {
      const report = await ReportingService.generateCarbonReport(
        user.mongo_id,
        'user',
        'weekly'
      );
      
      // Queue email sending (would integrate with email service)
      console.log(`Generated weekly report for ${user.mongo_id}`);
    } catch (error) {
      console.error(`Failed to generate report for ${user.mongo_id}:`, error);
    }
  }
}

async function retrainModels() {
  // Trigger ML service retraining
  try {
    await MLPrediction.callMLService('retrain', {
      modelType: 'emission_prediction',
      dataRange: { from: '2020-01-01', to: new Date().toISOString() }
    });
    console.log('ML models retrained successfully');
  } catch (error) {
    console.error('ML retraining failed:', error);
  }
}

async function checkEndingAuctions() {
  // Find auctions ending in next 5 minutes
  const endingSoon = await pgPool.query(
    `SELECT * FROM auctions 
     WHERE status = 'active' 
     AND end_time BETWEEN NOW() AND NOW() + INTERVAL '5 minutes'`
  );
  
  for (const auction of endingSoon.rows) {
    // Notify subscribers
    console.log(`Auction ${auction.id} ending soon`);
  }
}

module.exports = { setupJobs };