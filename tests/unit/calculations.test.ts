import { describe, it, expect } from 'vitest';
import { computeEnterpriseTaxA } from '../../src/server/services/TaxCalculationServiceA';
import { computeEnterpriseTaxB } from '../../src/server/services/TaxCalculationServiceB';
import { calculateTieredDiscount } from '../../src/server/services/PricingEngine';
import { reconcileLedgerTransactions } from '../../src/server/services/ReconciliationProcessor';

describe('Layered Monolith Domain Services Tests', () => {
  it('computes Region A tax with exemptions', () => {
    const items = [
      { id: '1', category: 'STANDARD', unitPrice: 100, quantity: 2 },
      { id: '2', category: 'ESSENTIAL_FOOD', unitPrice: 50, quantity: 1 }
    ];
    const res = computeEnterpriseTaxA(items, 0.10, null);
    expect(res.taxableSubtotal).toBe(200);
    expect(res.exemptSubtotal).toBe(50);
    expect(res.taxAmount).toBe(20);
    expect(res.totalWithTax).toBe(270);
  });

  it('computes Region B tax with certificate override', () => {
    const items = [{ id: '1', category: 'STANDARD', unitPrice: 500, quantity: 1 }];
    const res = computeEnterpriseTaxB(items, 0.08, 'TAX-EXEMPT-GOV-99');
    expect(res.taxAmount).toBe(0);
    expect(res.exemptSubtotal).toBe(500);
  });

  it('evaluates enterprise platinum multi-year discount', () => {
    const discount = calculateTieredDiscount(100000, 'ENTERPRISE_PLATINUM', 'MULTI_YEAR_PREPAID', false, 'NONE');
    expect(discount).toBe(20000);
  });

  it('reconciles ledger transactions batch', () => {
    const res = reconcileLedgerTransactions([
      { entries: [{ amount: 1500, isSettled: false, clearedByBank: true, hasDiscrepancy: false }] }
    ]);
    expect(res.reconciled).toBe(1);
    expect(res.discrepancies).toBe(0);
  });
});
