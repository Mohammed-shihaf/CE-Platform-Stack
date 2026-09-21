import { describe, it, expect } from 'vitest';
import { validateOrderPayload } from '../src/domain/orders/OrderValidator';
import { OrderWorkflowEngine } from '../src/domain/orders/OrderWorkflowEngine';
import { OrderTaxCalculationService } from '../src/domain/orders/OrderTaxCalculationService';
import { OrderRepository } from '../src/domain/orders/OrderRepository';

describe('Order Service Microservice Domain Tests', () => {
  const taxService = new OrderTaxCalculationService();
  const workflowEngine = new OrderWorkflowEngine();
  const repo = new OrderRepository();

  it('validates a correct order payload', () => {
    const res = validateOrderPayload({
      orderId: 'ORD-2001',
      customerId: 'CUST-88',
      amount: 150.00,
      currency: 'USD'
    });
    expect(res.valid).toBe(true);
    expect(res.normalizedAmount).toBe(150.00);
  });

  it('rejects an invalid payload with detailed reasons', () => {
    const res = validateOrderPayload({
      orderId: '',
      customerId: '',
      amount: -10,
      currency: 'INVALID'
    });
    expect(res.valid).toBe(false);
    expect(res.reasons.length).toBeGreaterThanOrEqual(2);
  });

  it('calculates multi-tier tax with municipal surcharge', () => {
    const res = taxService.calculateSettlementTax({
      baseAmount: 1200.00,
      countryCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxRate).toBe(0.0825);
    expect(res.surcharge).toBeGreaterThan(0);
    expect(res.totalGrossAmount).toBeGreaterThan(1200.00);
  });

  it('executes enterprise workflow priority routing', () => {
    const route = workflowEngine.executeOrderWorkflow('ENTERPRISE', 60000, false, 'NONE');
    expect(route).toBe('HIGH_VALUE_MANUAL_REVIEW');
  });

  it('manages orders in repository', () => {
    repo.save({
      orderId: 'ORD-9999',
      customerId: 'CUST-99',
      amount: 400.00,
      currency: 'USD',
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    });
    const found = repo.findById('ORD-9999');
    expect(found).toBeDefined();
    expect(found?.status).toBe('APPROVED');
  });
});
