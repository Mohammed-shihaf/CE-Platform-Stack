export interface PaymentTransactionRecord {
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  provider: string;
  status: 'APPROVED' | 'DECLINED' | 'ERROR';
  createdAt: string;
}

export class PaymentRepository {
  private ledger: Map<string, PaymentTransactionRecord> = new Map();

  public save(record: PaymentTransactionRecord): void {
    this.ledger.set(record.transactionId, record);
  }

  public findByTransactionId(transactionId: string): PaymentTransactionRecord | undefined {
    return this.ledger.get(transactionId);
  }

  public listAll(): PaymentTransactionRecord[] {
    return Array.from(this.ledger.values());
  }
}
