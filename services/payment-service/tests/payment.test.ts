import { describe, it, expect } from 'vitest';
import { validatePaymentPayload } from '../src/domain/payments/PaymentValidator';
import { PaymentSettlementTaxService } from '../src/domain/payments/PaymentSettlementTaxService';
import { PaymentRouter } from '../src/domain/payments/PaymentRouter';
import { PaymentRepository } from '../src/domain/payments/PaymentRepository';

describe('Payment Microservice Domain Tests', () => {
  const taxService = new PaymentSettlementTaxService();
  const router = new PaymentRouter();
  const repo = new PaymentRepository();

  it('validates a valid payment request payload', () => {
    const res = validatePaymentPayload({
      orderId: 'ORD-5001',
      amount: 250.00,
      currency: 'USD'
    });
    expect(res.valid).toBe(true);
    expect(res.reasons.length).toBe(0);
  });

  it('calculates settlement tax accurately in payment domain', () => {
    const res = taxService.calculateSettlementTax({
      baseAmount: 1000.00,
      countryCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxAmount).toBe(82.50);
    expect(res.totalGrossAmount).toBe(1082.50);
  });

  it('routes transaction through stripe gateway provider', () => {
    const route = router.routeTransaction([
      { provider: 'STRIPE', attempts: 1, amount: 500.00 }
    ]);
    expect(route.success).toBe(true);
    expect(route.selectedProvider).toBe('STRIPE');
  });

  it('stores and retrieves transaction in payment ledger', () => {
    repo.save({
      transactionId: 'TXN-777',
      orderId: 'ORD-777',
      amount: 500.00,
      currency: 'USD',
      provider: 'STRIPE',
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    });
    const item = repo.findByTransactionId('TXN-777');
    expect(item).toBeDefined();
    expect(item?.provider).toBe('STRIPE');
  });
});
