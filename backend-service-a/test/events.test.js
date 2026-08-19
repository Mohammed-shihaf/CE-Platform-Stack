const assert = require('assert');
const { recordEvents } = require('../src/events');

const RECORD_CREATED = 'record:created';

describe('recordEvents (service-a -> service-b fan-out)', () => {
  it('delivers a record:created payload to a listener', (done) => {
    const payload = { id: 'abc123', title: 'test record' };

    recordEvents.once(RECORD_CREATED, (received) => {
      assert.deepStrictEqual(received, payload);
      done();
    });

    recordEvents.emit(RECORD_CREATED, payload);
  });

  it('supports multiple concurrent listeners without dropping events', () => {
    let a = 0;
    let b = 0;
    const onA = () => { a += 1; };
    const onB = () => { b += 1; };

    recordEvents.on(RECORD_CREATED, onA);
    recordEvents.on(RECORD_CREATED, onB);
    recordEvents.emit(RECORD_CREATED, { id: 'x' });
    recordEvents.off(RECORD_CREATED, onA);
    recordEvents.off(RECORD_CREATED, onB);

    assert.strictEqual(a, 1);
    assert.strictEqual(b, 1);
  });
});
