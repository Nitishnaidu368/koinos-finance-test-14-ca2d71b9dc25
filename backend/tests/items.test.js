const request = require('supertest');
const express = require('express');
const itemsRouter = require('../src/routes/items');
const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, '../../data/items.json');

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

// Helper to reset data file before each test
const initialData = [
    { id: 1, name: 'Item One', price: 10 },
    { id: 2, name: 'Item Two', price: 20 }
];

beforeEach(() => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
});

describe('GET /api/items', () => {
    it('should return all items', async () => {
        const res = await request(app).get('/api/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should filter items by search query', async () => {
        const res = await request(app).get('/api/items?q=one');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Item One');
    });

    it('should limit results', async () => {
        const res = await request(app).get('/api/items?limit=1');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });
});

describe('GET /api/items/:id', () => {
    it('should return item by id', async () => {
        const res = await request(app).get('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Item One');
    });

    it('should return 404 for missing item', async () => {
        const res = await request(app).get('/api/items/999');
        expect(res.statusCode).toBe(404);
    });
});

describe('POST /api/items', () => {
    it('should add a new item', async () => {
        const newItem = { name: 'Item Three', price: 30 };
        const res = await request(app).post('/api/items').send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Item Three');
        // Should be persisted
        const data = JSON.parse(fs.readFileSync(DATA_PATH));
        expect(data.length).toBe(3);
    });
});
