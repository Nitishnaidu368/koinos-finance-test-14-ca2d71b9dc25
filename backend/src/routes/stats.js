const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');


// In-memory cache for stats
let cachedStats = null;
let lastMtime = null;

async function getStats() {
  const stat = await fs.promises.stat(DATA_PATH);
  if (cachedStats && lastMtime && stat.mtime.getTime() === lastMtime.getTime()) {
    return cachedStats;
  }
  const raw = await fs.promises.readFile(DATA_PATH);
  const items = JSON.parse(raw);
  const stats = {
    total: items.length,
    averagePrice: items.length > 0 ? items.reduce((acc, cur) => acc + cur.price, 0) / items.length : 0
  };
  cachedStats = stats;
  lastMtime = stat.mtime;
  return stats;
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;