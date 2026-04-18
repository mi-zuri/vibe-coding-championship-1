const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = Number(process.env.PORT) || 3000;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

app.get('/health', async (_req, res) => {
  if (!pool) return res.json({ status: 'ok', db: 'not-configured' });
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'up' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'down', error: err.message });
  }
});

app.get('/', (_req, res) => {
  res.json({ message: 'mi.zur-i.com backend is running' });
});

app.listen(port, () => {
  console.log(`backend listening on :${port}`);
});
