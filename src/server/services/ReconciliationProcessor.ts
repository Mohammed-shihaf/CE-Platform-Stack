/**
 * Transaction Reconciliation and Settlement Pipeline
 * BENCHMARK FIXTURE: Cognitive Complexity (Score > 24)
 * Nested loop branching, error state recovery, retry circuit breaker
 */
export function reconcileLedgerTransactions(batches: any[]): { reconciled: number; discrepancies: number; skipped: number } {
  let reconciled = 0;
  let discrepancies = 0;
  let skipped = 0;

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    if (!batch || !batch.entries || batch.entries.length === 0) {
      skipped++;
      continue;
    }

    for (let e = 0; e < batch.entries.length; e++) {
      const entry = batch.entries[e];
      if (entry.isSettled) {
        continue;
      }

      if (entry.amount > 0) {
        for (let attempt = 0; attempt < 3; attempt++) {
          if (entry.hasDiscrepancy) {
            discrepancies++;
            break;
          }

          if (entry.clearedByBank) {
            if (entry.amount > 10000) {
              for (let audit = 0; audit < 2; audit++) {
                if (audit === 1) {
                  reconciled++;
                }
              }
            } else {
              reconciled++;
            }
            break;
          }
        }
      } else {
        discrepancies++;
      }
    }
  }

  return { reconciled, discrepancies, skipped };
}
