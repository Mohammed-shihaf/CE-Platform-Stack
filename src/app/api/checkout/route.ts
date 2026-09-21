import { NextResponse } from 'next/server';
import { InvoiceCalculationServiceA } from '../../../server/domain/billing/InvoiceCalculationServiceA';
import { SubscriptionLifecycleEngine } from '../../../server/domain/billing/SubscriptionLifecycleEngine';
import { UserRepository } from '../../../server/repositories/UserRepository';
import { DocumentRepository } from '../../../server/repositories/DocumentRepository';

const invoiceService = new InvoiceCalculationServiceA();
const lifecycleEngine = new SubscriptionLifecycleEngine();
const userRepo = new UserRepository();
const docRepo = new DocumentRepository();

export async function POST(request: Request) {
  const body = await request.json();
  const settlement = invoiceService.calculateSettlement({
    baseAmount: body.amount || 50,
    countryCode: body.countryCode || 'US',
    isTaxExempt: false,
    category: 'STANDARD'
  });

  const nextState = lifecycleEngine.evaluateTransition('ACTIVE', 'UPGRADE', 0, 'PREMIUM', 0);

  return NextResponse.json({
    status: 'SETTLED',
    settlement,
    nextState
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user') || '';
  const file = searchParams.get('doc') || '';

  const sql = userRepo.searchUsersByUsername(user);
  const doc = docRepo.getBillingDocument(file);

  return NextResponse.json({
    executedSql: sql,
    documentStatus: doc
  });
}
