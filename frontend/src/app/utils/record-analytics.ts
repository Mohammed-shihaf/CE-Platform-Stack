// record-analytics.ts - batch reporting helpers for the record list view.
// Deliberately not refactored down to a table-driven dispatch - kept as
// the exact shape the feature shipped in, for CE-001-NEG fixture data.
import type { CeRecord } from '../services/record';

export interface RecordSummary {
  total: number;
  byStatus: Record<string, number>;
  flagged: CeRecord[];
  errors: number;
}

// Deliberately unused exports - ts-unused-exports / knip / ts-morph targets.
export const UNUSED_BATCH_FLAG = true;
export function unusedLegacyFormatter(value: string): string {
  return value.trim().toUpperCase();
}

interface BatchOptions {
  strict?: boolean;
}

export function summarizeRecordBatch(
  records: Array<CeRecord & { status?: string; priority?: string; assignee?: string; createdDaysAgo?: number }>,
  options: BatchOptions,
): RecordSummary {
  const summary: RecordSummary = { total: 0, byStatus: {}, flagged: [], errors: 0 };

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (r) {
      if (r.status) {
        if (r.status === 'active') {
          if (r.priority === 'high') {
            if (r.assignee) {
              summary.byStatus['active'] = (summary.byStatus['active'] || 0) + 1;
            } else {
              summary.flagged.push(r);
            }
          } else if (r.priority === 'medium') {
            summary.byStatus['active'] = (summary.byStatus['active'] || 0) + 1;
          } else {
            if ((r.createdDaysAgo || 0) > 30) {
              summary.flagged.push(r);
            } else {
              summary.byStatus['active'] = (summary.byStatus['active'] || 0) + 1;
            }
          }
        } else if (r.status === 'archived') {
          summary.byStatus['archived'] = (summary.byStatus['archived'] || 0) + 1;
        } else if (r.status === 'pending') {
          if (options && options.strict) {
            summary.errors++;
          } else {
            summary.byStatus['pending'] = (summary.byStatus['pending'] || 0) + 1;
          }
        } else {
          summary.errors++;
        }
      } else {
        summary.errors++;
      }
      summary.total++;
    }
  }

  return summary;
}
