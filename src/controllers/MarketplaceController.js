import { CarbonCredit } from '../models/mongodb/index.js';
import { pgPool } from '../config/database.js';

async function listCredits(req, res) {
  try {
    const credits = await CarbonCredit.find({ status: 'active' }).limit(50);
    res.json(credits);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getCreditDetails(req, res) {
  try {
    const credit = await CarbonCredit.findById(req.params.id);
    if (!credit) return res.status(404).json({ error: 'Credit not found' });
    res.json(credit);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function createPurchase(req, res) {
  try {
    res.status(201).json({ message: 'Purchase initiated', orderId: 'stub' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getPortfolio(req, res) {
  res.json({ credits: [] });
}

async function retireCredits(req, res) {
  res.json({ message: 'Retirement recorded' });
}

async function getAuctions(req, res) {
  try {
    const r = await pgPool.query('SELECT * FROM auctions WHERE status IN ($1,$2) LIMIT 20', ['scheduled', 'active']);
    res.json(r.rows);
  } catch (e) {
    res.json([]);
  }
}

async function createAuction(req, res) {
  res.status(201).json({ message: 'Auction created' });
}

async function placeBid(req, res) {
  res.json({ message: 'Bid placed' });
}

async function handleWebhook(req, res) {
  res.sendStatus(200);
}

export {
  listCredits,
  getCreditDetails,
  createPurchase,
  getPortfolio,
  retireCredits,
  getAuctions,
  createAuction,
  placeBid,
  handleWebhook,
};
