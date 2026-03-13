// Main router for the EcoFriendly API, defining all endpoints and linking them to controllers and middleware.
const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Controllers
const CarbonController = require('../controllers/CarbonController');
const MarketplaceController = require('../controllers/MarketplaceController');
const GeospatialController = require('../controllers/GeospatialController');
const ReportingController = require('../controllers/ReportingController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (public)
router.post('/auth/register', validate.register, AuthController.register);
router.post('/auth/login', validate.login, AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPassword);

// Protected routes
router.use(auth.authenticate);

// User profile
router.get('/user/profile', AuthController.getProfile);
router.put('/user/profile', validate.updateProfile, AuthController.updateProfile);
router.put('/user/location', AuthController.updateLocation);
router.get('/user/goals', AuthController.getGoals);
router.post('/user/goals', validate.createGoal, AuthController.createGoal);

// Carbon entries
router.post('/carbon/entries', validate.carbonEntry, CarbonController.createEntry);
router.get('/carbon/entries', CarbonController.getEntries);
router.post('/carbon/entries/batch', CarbonController.batchImport);
router.delete('/carbon/entries/:id', CarbonController.deleteEntry);

// Dashboard & analytics
router.get('/carbon/dashboard', CarbonController.getDashboard);
router.get('/carbon/heatmap', CarbonController.getHeatmap);
router.get('/carbon/predictions', CarbonController.getPredictions);

// Marketplace
router.get('/marketplace/credits', MarketplaceController.listCredits);
router.get('/marketplace/credits/:id', MarketplaceController.getCreditDetails);
router.post('/marketplace/purchase', validate.purchase, MarketplaceController.createPurchase);
router.get('/marketplace/portfolio', MarketplaceController.getPortfolio);
router.post('/marketplace/retire', validate.retirement, MarketplaceController.retireCredits);

// Auctions
router.get('/marketplace/auctions', MarketplaceController.getAuctions);
router.post('/marketplace/auctions', validate.createAuction, MarketplaceController.createAuction);
router.post('/marketplace/auctions/:id/bid', validate.bid, MarketplaceController.placeBid);

// Geospatial
router.get('/geo/nearby', GeospatialController.findNearbyHubs);
router.post('/geo/route', GeospatialController.calculateRoute);
router.get('/geo/insights', GeospatialController.getSpatialInsights);
router.post('/geo/hubs', validate.createHub, GeospatialController.createHub);
router.post('/geo/checkin', GeospatialController.checkIn);
router.get('/geo/renewable-potential', GeospatialController.analyzeRenewablePotential);

// Reporting
router.get('/reports/carbon', ReportingController.generateCarbonReport);
router.get('/reports/portfolio', ReportingController.generatePortfolioReport);
router.post('/reports/custom', ReportingController.createCustomReport);
router.get('/reports/download/:id', ReportingController.downloadReport);

// Webhook (special handling for Stripe)
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), 
  MarketplaceController.handleWebhook);

module.exports = router;