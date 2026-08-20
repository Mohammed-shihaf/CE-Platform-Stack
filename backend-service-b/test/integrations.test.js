const assert = require('assert');
const { SNS_ENDPOINT, TOPIC_NAME } = require('../src/sns');
const { SES_ENDPOINT } = require('../src/ses');
const { ELASTIC_URL, INDEX_NAME } = require('../src/es');

// These modules construct their AWS/ES clients lazily (no network call at
// require time), so their real exported defaults can be asserted directly
// without a live SNS/SES/Elasticsearch endpoint.
describe('integration client defaults (service-b)', () => {
  it('SNS defaults to the localstack endpoint and the real topic name', () => {
    assert.strictEqual(SNS_ENDPOINT, 'http://localhost:4566');
    assert.strictEqual(TOPIC_NAME, 'record-created');
  });

  it('SES defaults to the localstack endpoint', () => {
    assert.strictEqual(SES_ENDPOINT, 'http://localhost:4566');
  });

  it('Elasticsearch defaults to the local cluster and the real index name', () => {
    assert.strictEqual(ELASTIC_URL, 'http://localhost:9200');
    assert.strictEqual(INDEX_NAME, 'records');
  });
});
