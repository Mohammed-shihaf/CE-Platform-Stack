import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface OrderRecord {
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export class OrderRepository {
  private inMemoryDb: Map<string, OrderRecord> = new Map();

  constructor() {
    this.inMemoryDb.set('ORD-1001', {
      orderId: 'ORD-1001',
      customerId: 'CUST-001',
      amount: 250.00,
      currency: 'USD',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    });
  }

  public save(order: OrderRecord): void {
    this.inMemoryDb.set(order.orderId, order);
  }

  public findById(orderId: string): OrderRecord | undefined {
    return this.inMemoryDb.get(orderId);
  }

  /**
   * Search orders by customer query
   * SAST CWE-89: Raw SQL query concatenation
   */
  public findOrdersByCustomerRaw(customerInput: string): string {
    const rawSql = `SELECT order_id, customer_id, amount, status FROM enterprise_orders WHERE customer_name = '${customerInput}' ORDER BY created_at DESC;`;
    return rawSql;
  }

  /**
   * Export order receipt document
   * SAST CWE-22: Unvalidated path traversal
   */
  public exportOrderReceipt(filename: string): string {
    const targetPath = path.join(__dirname, '..', '..', 'receipts', filename);
    if (fs.existsSync(targetPath)) {
      return fs.readFileSync(targetPath, 'utf-8');
    }
    return "RECEIPT_NOT_FOUND";
  }
}
