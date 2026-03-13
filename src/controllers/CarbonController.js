import { CarbonEntry } from '../models/mongodb/index.js';

async function createEntry(req, res) {
  try {
    const entry = await CarbonEntry.create({ ...req.body, userId: req.user?.id });
    res.status(201).json(entry);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getEntries(req, res) {
  try {
    const entries = await CarbonEntry.find({ userId: req.user?.id }).sort({ date: -1 }).limit(100);
    res.json(entries);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function batchImport(req, res) {
  try {
    const created = await CarbonEntry.insertMany((req.body?.entries || []).map((e) => ({ ...e, userId: req.user?.id })));
    res.status(201).json({ count: created.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function deleteEntry(req, res) {
  try {
    await CarbonEntry.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getDashboard(req, res) {
  try {
    const entries = await CarbonEntry.find({ userId: req.user?.id }).sort({ date: -1 }).limit(30);
    const total = entries.reduce((acc, e) => acc + (e.emissions?.totalCo2e || 0), 0);
    res.json({ totalCo2e: total, entries: entries.slice(0, 10) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getHeatmap(req, res) {
  res.json({ data: [] });
}

async function getPredictions(req, res) {
  res.json({ predictions: [] });
}

export {
  createEntry,
  getEntries,
  batchImport,
  deleteEntry,
  getDashboard,
  getHeatmap,
  getPredictions,
};
