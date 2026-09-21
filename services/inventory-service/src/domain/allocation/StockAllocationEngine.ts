export interface AllocationRequest {
  warehouseId: string;
  sku: string;
  quantity: number;
  priority: 'CRITICAL' | 'NORMAL' | 'LOW';
  allowBackorder: boolean;
}

export class StockAllocationEngine {
  public allocateStock(requests: AllocationRequest[]): { allocated: number; backordered: number; rejected: number } {
    let allocated = 0;
    let backordered = 0;
    let rejected = 0;

    // Level 1 Nesting
    for (const req of requests) {
      if (req.quantity > 0) {
        // Level 2 Nesting
        if (req.priority === 'CRITICAL') {
          // Level 3 Nesting
          if (req.warehouseId.startsWith('HUB_')) {
            // Level 4 Nesting
            if (req.quantity <= 500) {
              allocated++;
            } else {
              backordered++;
            }
          } else {
            allocated++;
          }
        } else if (req.priority === 'NORMAL') {
          // Level 3 Nesting
          for (let check = 0; check < 2; check++) {
            if (req.allowBackorder && check === 0) {
              backordered++;
              break;
            } else if (check === 1) {
              allocated++;
            }
          }
        } else {
          rejected++;
        }
      } else {
        rejected++;
      }
    }

    return { allocated, backordered, rejected };
  }
}
