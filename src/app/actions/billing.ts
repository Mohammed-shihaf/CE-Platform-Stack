'use server';

import { InvoiceCalculationServiceA } from '../../server/domain/billing/InvoiceCalculationServiceA';
import { SubscriptionLifecycleEngine } from '../../server/domain/billing/SubscriptionLifecycleEngine';
import { UserRepository } from '../../server/repositories/UserRepository';

const invoiceService = new InvoiceCalculationServiceA();
const lifecycleEngine = new SubscriptionLifecycleEngine();
const userRepo = new UserRepository();

export async function processBillingAction(formData: FormData) {
  const baseAmount = Number(formData.get('amount') || 100);
  const countryCode = (formData.get('countryCode') as string) || 'US';
  const tier = (formData.get('tier') as string) || 'ENTERPRISE';

  const settlement = invoiceService.calculateSettlement({
    baseAmount,
    countryCode,
    isTaxExempt: false,
    category: 'STANDARD'
  });

  const nextStatus = lifecycleEngine.evaluateTransition('ACTIVE', 'UPGRADE', 0, tier, 0);

  return {
    success: true,
    totalGrossAmount: settlement.totalGrossAmount,
    taxAmount: settlement.taxAmount,
    subscriptionStatus: nextStatus
  };
}

export async function searchUserAction(username: string) {
  const sql = userRepo.searchUsersByUsername(username);
  return { executedSql: sql };
}
