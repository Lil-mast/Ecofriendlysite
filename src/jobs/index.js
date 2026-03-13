// background jobs for data aggregation, reporting, and ML tasks
import cron from 'node-cron';
import { CarbonEntry } from '../models/mongodb/index.js';
import { pgPool } from '../config/database.js';
import ReportingService from '../services/analytics/Reporting.js';
import MLPrediction from '../services/ai/MLPrediction.js';

export function setupJobs() {
  cron.schedule('0 2 * * *', async () => {
    console.log('Running daily aggregation...');
    await runDailyAggregation();
  });

  cron.schedule('0 9 * * 1', async () => {
    console.log('Generating weekly reports...');
    await generateWeeklyReports();
  });

  cron.schedule('0 3 1 * *', async () => {
    console.log('Retraining ML models...');
    await retrainModels();
  });

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
  const users = await pgPool.query(
    'SELECT mongo_id FROM users WHERE created_at < NOW() - INTERVAL \'7 days\''
  );

  for (const user of users.rows) {
    try {
      await ReportingService.generateCarbonReport(user.mongo_id, 'user', 'weekly');
      console.log(`Generated weekly report for ${user.mongo_id}`);
    } catch (error) {
      console.error(`Failed to generate report for ${user.mongo_id}:`, error);
    }
  }
}

async function retrainModels() {
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
  const endingSoon = await pgPool.query(
    `SELECT * FROM auctions 
     WHERE status = 'active' 
     AND end_time BETWEEN NOW() AND NOW() + INTERVAL '5 minutes'`
  );

  for (const auction of endingSoon.rows) {
    console.log(`Auction ${auction.id} ending soon`);
  }
}
