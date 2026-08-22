import { summarizeRecordBatch } from './record-analytics';

// Deliberately partial: summarizeRecordBatch has several branches (active+
// high-priority+no-assignee, active+medium-priority, active+low-priority+
// not-flagged, pending+strict, unknown status) that are NOT exercised here.
// This is intentional - CE-001-NEG needs real, uncovered branches for
// coverage-gap and mutation-survivor metrics, not 100% coverage everywhere.
describe('summarizeRecordBatch (partial coverage, intentional)', () => {
  it('counts a record with no status as an error', () => {
    const result = summarizeRecordBatch([{ id: '1', title: '', description: '', createdAt: '' }], {});
    expect(result.errors).toBe(1);
    expect(result.total).toBe(1);
  });

  it('counts an active, high-priority, assigned record as active', () => {
    const result = summarizeRecordBatch(
      [{ id: '1', title: '', description: '', createdAt: '', status: 'active', priority: 'high', assignee: 'alice' }],
      {},
    );
    expect(result.byStatus['active']).toBe(1);
  });

  it('flags an active, low-priority record older than 30 days', () => {
    const result = summarizeRecordBatch(
      [{ id: '1', title: '', description: '', createdAt: '', status: 'active', priority: 'low', createdDaysAgo: 45 }],
      {},
    );
    expect(result.flagged.length).toBe(1);
  });

  it('counts an archived record', () => {
    const result = summarizeRecordBatch([{ id: '1', title: '', description: '', createdAt: '', status: 'archived' }], {});
    expect(result.byStatus['archived']).toBe(1);
  });

  it('counts a pending record as pending when not in strict mode', () => {
    const result = summarizeRecordBatch(
      [{ id: '1', title: '', description: '', createdAt: '', status: 'pending' }],
      { strict: false },
    );
    expect(result.byStatus['pending']).toBe(1);
  });
});
