import { describe, it, expect } from 'vitest';
import { TaxSettlementEngine } from '../src/domain/tax/TaxSettlementEngine';
import { TaxWorkflowEngine } from '../src/domain/workflow/TaxWorkflowEngine';
import { BillingRepository } from '../src/repositories/BillingRepository';

describe('NestJS Billing Microservice Domain Tests', () => {
  const taxEngine = new TaxSettlementEngine();
  const workflowEngine = new TaxWorkflowEngine();
  const billingRepo = new BillingRepository();

  it('computes standard tax settlement', () => {
    const res = taxEngine.computeTaxSettlement({
      baseAmount: 1000,
      stateCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxAmount).toBe(82.50);
    expect(res.totalGrossAmount).toBe(1082.50);
  });

  it('evaluates enterprise cross border treaty workflow', () => {
    const route = workflowEngine.evaluateTaxWorkflow('ENTERPRISE', 50000, true, true);
    expect(route).toBe('CROSS_BORDER_TREATY_EXEMPT');
  });

  it('evaluates commercial domestic workflow', () => {
    const route = workflowEngine.evaluateTaxWorkflow('COMMERCIAL', 10000, false, false);
    expect(route).toBe('COMMERCIAL_STANDARD_QUEUE');
  });

  it('generates customer invoice query in repository', () => {
    const q = billingRepo.queryInvoicesByCustomerRaw('Acme Corp');
    expect(q).toContain("SELECT id, invoice_number");
    expect(q).toContain("Acme Corp");
  });
});
