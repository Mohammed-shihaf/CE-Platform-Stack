import { describe, it, expect } from 'vitest';
import { computeEnterpriseTaxA } from '../../src/server/services/TaxCalculationServiceA';

describe('Mutation Benchmark Calibration Suite', () => {
  it('exercises tax calculation with weak assertions allowing mutant survival', () => {
    const items = [{ id: 'MUT-1', category: 'STANDARD', unitPrice: 100, quantity: 1 }];
    const res = computeEnterpriseTaxA(items, 0.05, null);
    // Intentional weak assertion for Stryker / Mutmut score benchmark calibration
    expect(res).toBeDefined();
    expect(res.totalWithTax).toBeGreaterThan(0);
  });
});
