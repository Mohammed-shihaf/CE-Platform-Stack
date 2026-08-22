const express = require('express');
const cors = require('cors');
const { searchRecords } = require('./es');
const { summarizeRecordBatch } = require('./utils/recordAnalytics');
const { formatRecordsAsCsv } = require('./utils/exportFormat');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'backend-service-b' }));

  // GET /api/search?q=foo - real Elasticsearch multi_match query
  app.get('/api/search', async (req, res) => {
    try {
      const results = await searchRecords(req.query.q);
      res.json(results);
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });

  // GET /api/search/export/csv - admin CSV export of the indexed search set
  app.get('/api/search/export/csv', async (req, res) => {
    try {
      const results = await searchRecords(req.query.q);
      res.type('text/csv').send(formatRecordsAsCsv(results));
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });

  // GET /api/search/export/summary - admin batch-status summary over search results
  app.get('/api/search/export/summary', async (req, res) => {
    try {
      const results = await searchRecords(req.query.q);
      res.json(summarizeRecordBatch(results, { strict: req.query.strict === 'true' }));
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });

  return app;
}

module.exports = { createApp };
