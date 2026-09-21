import { describe, it, expect } from 'vitest';
import { InvoiceCalculationServiceA } from '../src/server/domain/billing/InvoiceCalculationServiceA';
import { InvoiceCalculationServiceB } from '../src/server/domain/billing/InvoiceCalculationServiceB';
import { SubscriptionLifecycleEngine } from '../src/server/domain/billing/SubscriptionLifecycleEngine';
import { UserRepository } from '../src/server/repositories/UserRepository';

describe('Next.js 15 Monolith Domain Billing Tests', () => {
  const serviceA = new InvoiceCalculationServiceA();
  const serviceB = new InvoiceCalculationServiceB();
  const engine = new SubscriptionLifecycleEngine();
  const userRepo = new UserRepository();

  it('calculates invoice settlement via Service A', () => {
    const res = serviceA.calculateSettlement({
      baseAmount: 1000,
      countryCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxAmount).toBe(82.50);
    expect(res.totalGrossAmount).toBe(1082.50);
  });

  it('calculates invoice settlement via Service B with parity', () => {
    const res = serviceB.calculateSettlement({
      baseAmount: 1000,
      countryCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxAmount).toBe(82.50);
    expect(res.totalGrossAmount).toBe(1082.50);
  });

  it('evaluates executive retention path for enterprise cancellation', () => {
    const status = engine.evaluateTransition('ACTIVE', 'CANCEL', 0, 'ENTERPRISE', 0);
    expect(status).toBe('PENDING_EXECUTIVE_RETENTION');
  });

  it('evaluates dunning transitions for failed payments', () => {
    const status = engine.evaluateTransition('ACTIVE', 'PAYMENT_FAILED', 10, 'STANDARD', 50);
    expect(status).toBe('DUNNING_FINAL_NOTICE');
  });

  it('generates raw search query in user repository', () => {
    const query = userRepo.searchUsersByUsername("admin' OR '1'='1");
    expect(query).toContain("SELECT id, username");
    expect(query).toContain("admin' OR '1'='1");
  });
});
