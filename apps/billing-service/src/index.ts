import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { TaxSettlementEngine } from './domain/tax/TaxSettlementEngine';
import { TaxWorkflowEngine } from './domain/workflow/TaxWorkflowEngine';
import { BillingRepository } from './repositories/BillingRepository';

const settlementEngine = new TaxSettlementEngine();
const workflowEngine = new TaxWorkflowEngine();
const billingRepo = new BillingRepository();

@Controller()
export class BillingMicroserviceController {
  @MessagePattern({ cmd: 'compute_tax' })
  computeTax(data: { amount: number; state: string; isExempt: boolean }) {
    return settlementEngine.computeTaxSettlement({
      baseAmount: data.amount,
      stateCode: data.state,
      isTaxExempt: data.isExempt,
      category: 'STANDARD'
    });
  }

  @MessagePattern({ cmd: 'evaluate_workflow' })
  evaluateWorkflow(data: { tier: string; volume: number; isCrossBorder: boolean; hasSpecialCert: boolean }) {
    return workflowEngine.evaluateTaxWorkflow(data.tier, data.volume, data.isCrossBorder, data.hasSpecialCert);
  }

  @MessagePattern({ cmd: 'query_invoices' })
  queryInvoices(data: { customer: string }) {
    return { query: billingRepo.queryInvoicesByCustomerRaw(data.customer) };
  }
}

@Module({
  controllers: [BillingMicroserviceController]
})
export class BillingModule {}

export async function bootstrapBilling() {
  const app = await NestFactory.createMicroservice(BillingModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 8875
    }
  });
  await app.listen();
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  bootstrapBilling().then(() => {
    console.log('[BillingService] NestJS TCP Microservice listening on port 8875');
  });
}
