import express from 'express';
import * as auth from '../middleware/auth.js';
import * as validate from '../middleware/validate.js';
import * as CarbonController from '../controllers/CarbonController.js';
import * as MarketplaceController from '../controllers/MarketplaceController.js';
import GeospatialController from '../controllers/GeospatialController.js';
import * as ReportingController from '../controllers/ReportingController.js';
import * as AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/auth/register', validate.register, AuthController.register);
router.post('/auth/login', validate.login, AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPassword);

router.use(auth.authenticate);

router.get('/user/profile', AuthController.getProfile);
router.put('/user/profile', validate.updateProfile, AuthController.updateProfile);
router.put('/user/location', AuthController.updateLocation);
router.get('/user/goals', AuthController.getGoals);
router.post('/user/goals', validate.createGoal, AuthController.createGoal);

router.post('/carbon/entries', validate.carbonEntry, CarbonController.createEntry);
router.get('/carbon/entries', CarbonController.getEntries);
router.post('/carbon/entries/batch', CarbonController.batchImport);
router.delete('/carbon/entries/:id', CarbonController.deleteEntry);
router.get('/carbon/dashboard', CarbonController.getDashboard);
router.get('/carbon/heatmap', CarbonController.getHeatmap);
router.get('/carbon/predictions', CarbonController.getPredictions);

router.get('/marketplace/credits', MarketplaceController.listCredits);
router.get('/marketplace/credits/:id', MarketplaceController.getCreditDetails);
router.post('/marketplace/purchase', validate.purchase, MarketplaceController.createPurchase);
router.get('/marketplace/portfolio', MarketplaceController.getPortfolio);
router.post('/marketplace/retire', validate.retirement, MarketplaceController.retireCredits);
router.get('/marketplace/auctions', MarketplaceController.getAuctions);
router.post('/marketplace/auctions', validate.createAuction, MarketplaceController.createAuction);
router.post('/marketplace/auctions/:id/bid', validate.bid, MarketplaceController.placeBid);

router.get('/geo/nearby', GeospatialController.findNearbyHubs);
router.post('/geo/route', GeospatialController.calculateRoute);
router.get('/geo/insights', GeospatialController.getSpatialInsights);
router.post('/geo/hubs', validate.createHub, GeospatialController.createHub);
router.post('/geo/checkin', GeospatialController.checkIn);
router.get('/geo/renewable-potential', GeospatialController.analyzeRenewablePotential);

router.get('/reports/carbon', ReportingController.generateCarbonReport);
router.get('/reports/portfolio', ReportingController.generatePortfolioReport);
router.post('/reports/custom', ReportingController.createCustomReport);
router.get('/reports/download/:id', ReportingController.downloadReport);

router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), MarketplaceController.handleWebhook);

export default router;
