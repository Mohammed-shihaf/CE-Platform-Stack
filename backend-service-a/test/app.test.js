const assert = require('assert');
const http = require('http');
const { createApp } = require('../src/app');

// createApp() only wires routes/middleware - it never opens a DB or gRPC
// connection, so this exercises the real Express app in isolation without
// needing MongoDB running.
function withServer(app, fn) {
  const server = http.createServer(app);
  return new Promise((resolve, reject) => {
    server.listen(0, () => {
      const { port } = server.address();
      fn(port)
        .then(resolve, reject)
        .finally(() => server.close());
    });
  });
}

function get(port, path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    }).on('error', reject);
  });
}

describe('backend-service-a app', () => {
  it('GET /health reports the real service identity', async () => {
    const app = createApp();
    const { status, body } = await withServer(app, (port) => get(port, '/health'));

    assert.strictEqual(status, 200);
    assert.deepStrictEqual(body, { status: 'ok', service: 'backend-service-a' });
  });

  it('POST /api/records rejects a payload with no title', async () => {
    const app = createApp();
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();

    const result = await new Promise((resolve, reject) => {
      const req = http.request(
        { host: '127.0.0.1', port, path: '/api/records', method: 'POST', headers: { 'content-type': 'application/json' } },
        (res) => {
          let body = '';
          res.on('data', (c) => { body += c; });
          res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        },
      );
      req.on('error', reject);
      req.end(JSON.stringify({ description: 'no title here' }));
    });
    server.close();

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.body, { error: 'title is required' });
  });
});
