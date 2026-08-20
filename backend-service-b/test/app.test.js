const assert = require('assert');
const http = require('http');
const { createApp } = require('../src/app');

// createApp() wires routes only; searchRecords() (which needs a live
// Elasticsearch) is invoked lazily inside the route handler, so /health
// can be exercised in full isolation.
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

describe('backend-service-b app', () => {
  it('GET /health reports the real service identity', async () => {
    const app = createApp();
    const { status, body } = await withServer(app, (port) => get(port, '/health'));

    assert.strictEqual(status, 200);
    assert.deepStrictEqual(body, { status: 'ok', service: 'backend-service-b' });
  });

  it('GET /api/search surfaces a 502 when Elasticsearch is unreachable', async function () {
    // The real @elastic/elasticsearch client retries a connection-refused
    // error internally before giving up, which takes longer than mocha's
    // default 2000ms timeout.
    this.timeout(10000);

    const app = createApp();
    const { status, body } = await withServer(app, (port) => get(port, '/api/search?q=foo'));

    // The real @elastic/elasticsearch ConnectionError surfaces here with an
    // empty .message, so the meaningful, real signal is the 502 status plus
    // the 'error' key actually being present in the response.
    assert.strictEqual(status, 502);
    assert.ok('error' in body, 'expected an error key in the 502 response body');
  });
});
