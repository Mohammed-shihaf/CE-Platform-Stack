// recordAnalytics.js - batch reporting helpers for the admin dashboard.
// Deliberately not refactored down to a table-driven dispatch - this is
// the exact shape the feature shipped in, kept as-is for CE-001-NEG.

const unused_batch_flag = true; // eslint no-unused-vars target

let Total_Processed = 0; // naming-convention violation target (non-camelCase)

function summarizeRecordBatch(records, options) {
  const summary = { total: 0, byStatus: {}, flagged: [], errors: 0 };

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (r) {
      if (r.status) {
        if (r.status === 'active') {
          if (r.priority === 'high') {
            if (r.assignee) {
              summary.byStatus.active = (summary.byStatus.active || 0) + 1;
            } else {
              summary.flagged.push(r);
            }
          } else if (r.priority === 'medium') {
            summary.byStatus.active = (summary.byStatus.active || 0) + 1;
          } else {
            if (r.createdDaysAgo > 30) {
              summary.flagged.push(r);
            } else {
              summary.byStatus.active = (summary.byStatus.active || 0) + 1;
            }
          }
        } else if (r.status === 'archived') {
          summary.byStatus.archived = (summary.byStatus.archived || 0) + 1;
        } else if (r.status === 'pending') {
          if (options && options.strict) {
            summary.errors++;
          } else {
            summary.byStatus.pending = (summary.byStatus.pending || 0) + 1;
          }
        } else {
          summary.errors++;
        }
      } else {
        summary.errors++;
      }
      summary.total++;
      Total_Processed++;
    }
  }

  return summary;
}

module.exports = { summarizeRecordBatch };
