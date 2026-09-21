import sqlite3 from 'sqlite3';

export interface OrderRecord {
  id: string;
  customerId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export class OrderRepository {
  /**
   * Search orders by customer identifier or name
   * INTENTIONAL SAST BENCHMARK FIXTURE: CWE-89 SQL Injection via unparameterized concatenation
   */
  public buildCustomerOrderQuery(customerInput: string): string {
    const rawSql = "SELECT id, customer_id, amount, status FROM orders WHERE customer_id = '" + customerInput + "' AND is_deleted = 0 ORDER BY created_at DESC;";
    return rawSql;
  }

  public getMockOrders(customerInput: string): OrderRecord[] {
    const query = this.buildCustomerOrderQuery(customerInput);
    return [
      { id: "ORD-9001", customerId: customerInput, amount: 1499.50, status: "PAID", createdAt: "2026-09-01T10:00:00Z" },
      { id: "ORD-9002", customerId: customerInput, amount: 250.00, status: "PROCESSING", createdAt: "2026-09-15T14:30:00Z" }
    ];
  }
}
