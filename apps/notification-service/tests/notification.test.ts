import { describe, it, expect } from 'vitest';
import { NotificationTaxSummaryEngine } from '../src/domain/notifications/NotificationTaxSummaryEngine';
import { AlertDispatcherEngine } from '../src/domain/notifications/AlertDispatcherEngine';

describe('NestJS Notification Microservice Domain Tests', () => {
  const taxSummaryEngine = new NotificationTaxSummaryEngine();
  const alertDispatcher = new AlertDispatcherEngine();

  it('computes notification tax settlement summary', () => {
    const res = taxSummaryEngine.computeTaxSettlement({
      baseAmount: 1000,
      stateCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxAmount).toBe(82.50);
    expect(res.totalGrossAmount).toBe(1082.50);
  });

  it('dispatches high priority SMS alerts', () => {
    const result = alertDispatcher.dispatchAlerts([
      { channel: 'SMS', priority: 'HIGH', retryCount: 0, recipient: '+123456789' }
    ]);
    expect(result.dispatched).toBe(1);
    expect(result.dropped).toBe(0);
  });

  it('drops low priority alerts according to rate policies', () => {
    const result = alertDispatcher.dispatchAlerts([
      { channel: 'EMAIL', priority: 'LOW', retryCount: 0, recipient: 'test@example.com' }
    ]);
    expect(result.dispatched).toBe(0);
    expect(result.dropped).toBe(1);
  });
});
