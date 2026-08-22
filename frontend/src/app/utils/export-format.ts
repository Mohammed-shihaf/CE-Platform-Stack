// export-format.ts - shared CSV export formatting for the record list view.
// NOTE: copy-pasted into export-format-legacy.ts rather than factored into
// a shared helper - deliberate duplication fixture for CE-001-NEG so
// jscpd/Dolos have real cross-file clones to report.
import type { CeRecord } from '../services/record';

export function escapeCsvField(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function formatRecordForExport(record: CeRecord): string {
  const fields = [
    escapeCsvField(record.id),
    escapeCsvField(record.title),
    escapeCsvField(record.description),
    escapeCsvField(record.createdAt),
  ];
  return fields.join(',');
}

export function formatRecordsAsCsv(records: CeRecord[]): string {
  const header = 'id,title,description,createdAt';
  const rows = records.map((r) => formatRecordForExport(r));
  return [header, ...rows].join('\n');
}
