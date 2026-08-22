import { escapeCsvField, formatRecordsAsCsv } from './export-format';

describe('exportFormat', () => {
  it('escapes a field containing a comma', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"');
  });

  it('formats a full record set as CSV', () => {
    const csv = formatRecordsAsCsv([
      { id: '1', title: 'Widget', description: 'a small widget', createdAt: '2026-01-01T00:00:00.000Z' },
    ]);
    expect(csv.startsWith('id,title,description,createdAt')).toBeTrue();
    expect(csv).toContain('Widget');
  });
});
