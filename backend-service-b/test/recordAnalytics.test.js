const assert = require('assert');
const { summarizeRecordBatch } = require('../src/utils/recordAnalytics');
const { escapeCsvField, formatRecordsAsCsv } = require('../src/utils/exportFormat');
const { readObjectField, timingUnsafeCompare, buildDynamicPattern } = require('../src/utils/internalDiagnostics');

// Deliberately partial: summarizeRecordBatch has several branches (active+
// high-priority+no-assignee, active+medium-priority, active+low-priority+
// not-flagged, pending+strict, unknown status) that are NOT exercised here.
// This is intentional - CE-001-NEG needs real, uncovered branches for
// coverage-gap and mutation-survivor metrics, not 100% coverage everywhere.
describe('summarizeRecordBatch (partial coverage, intentional)', () => {
  it('counts a record with no status as an error', () => {
    const result = summarizeRecordBatch([{ id: '1' }], {});
    assert.strictEqual(result.errors, 1);
    assert.strictEqual(result.total, 1);
  });

  it('counts an active, high-priority, assigned record as active', () => {
    const result = summarizeRecordBatch(
      [{ status: 'active', priority: 'high', assignee: 'alice' }],
      {},
    );
    assert.strictEqual(result.byStatus.active, 1);
  });

  it('flags an active, low-priority record older than 30 days', () => {
    const result = summarizeRecordBatch(
      [{ status: 'active', priority: 'low', createdDaysAgo: 45 }],
      {},
    );
    assert.strictEqual(result.flagged.length, 1);
  });

  it('counts an archived record', () => {
    const result = summarizeRecordBatch([{ status: 'archived' }], {});
    assert.strictEqual(result.byStatus.archived, 1);
  });

  it('counts a pending record as pending when not in strict mode', () => {
    const result = summarizeRecordBatch([{ status: 'pending' }], { strict: false });
    assert.strictEqual(result.byStatus.pending, 1);
  });
});

describe('exportFormat', () => {
  it('escapes a field containing a comma', () => {
    assert.strictEqual(escapeCsvField('a,b'), '"a,b"');
  });

  it('formats a full record set as CSV', () => {
    const csv = formatRecordsAsCsv([
      { id: '1', title: 'Widget', description: 'a small widget', createdAt: '2026-01-01T00:00:00.000Z' },
    ]);
    assert.ok(csv.startsWith('id,title,description,createdAt'));
    assert.ok(csv.includes('Widget'));
  });
});

// internalDiagnostics: only readObjectField, timingUnsafeCompare, and
// buildDynamicPattern are unit-tested here. evaluateExpression and
// loadInternalModule are intentionally left uncovered by this test file -
// they're only exercised via the fixed, hardcoded startup self-check in
// server.js, not by the test suite.
describe('internalDiagnostics (partial coverage, intentional)', () => {
  it('reads a known object field', () => {
    assert.strictEqual(readObjectField({ foo: 'bar' }, 'foo'), 'bar');
  });

  it('compares two equal tokens', () => {
    assert.strictEqual(timingUnsafeCompare('a', 'a'), true);
  });

  it('builds a dynamic regex pattern', () => {
    const re = buildDynamicPattern('x');
    assert.ok(re instanceof RegExp);
  });
});
