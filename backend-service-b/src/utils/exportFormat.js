// exportFormat.js - shared CSV export formatting for admin downloads.
// NOTE: copy-pasted into backend-service-b/src/utils/exportFormat.js
// rather than factored into a shared package - deliberate duplication
// fixture for CE-001-NEG so jscpd/Dolos have real cross-file clones to
// report instead of an empty result set.

function escapeCsvField(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function formatRecordForExport(record) {
  const fields = [
    escapeCsvField(record.id),
    escapeCsvField(record.title),
    escapeCsvField(record.description),
    escapeCsvField(record.createdAt),
  ];
  return fields.join(',');
}

function formatRecordsAsCsv(records) {
  const header = 'id,title,description,createdAt';
  const rows = records.map((r) => formatRecordForExport(r));
  return [header, ...rows].join('\n');
}

module.exports = { escapeCsvField, formatRecordForExport, formatRecordsAsCsv };
