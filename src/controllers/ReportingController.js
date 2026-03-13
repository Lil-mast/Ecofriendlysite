import ReportingService from '../services/analytics/Reporting.js';

async function generateCarbonReport(req, res) {
  try {
    const report = await ReportingService.generateCarbonReport(req.user?.id, 'user', req.query.period || 'monthly');
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function generatePortfolioReport(req, res) {
  res.json({ report: 'Portfolio report stub' });
}

async function createCustomReport(req, res) {
  res.status(201).json({ id: 'stub', message: 'Report created' });
}

async function downloadReport(req, res) {
  res.status(404).json({ error: 'Report not found' });
}

export {
  generateCarbonReport,
  generatePortfolioReport,
  createCustomReport,
  downloadReport,
};
