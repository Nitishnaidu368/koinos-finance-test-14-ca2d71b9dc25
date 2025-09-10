const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');


// Utility to read data (async)
async function readData() {
  const raw = await fs.promises.readFile(DATA_PATH);
  return JSON.parse(raw);
}

// Utility to write data (async)
async function writeData(data) {
  await fs.promises.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { q, page = 1, pageSize = 20 } = req.query;
    let results = data;

    if (q) {
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const size = parseInt(pageSize) || 20;
    const start = (pageNum - 1) * size;
    const paginated = results.slice(start, start + size);

    res.json({
      items: paginated,
      total: results.length,
      page: pageNum,
      pageSize: size
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;