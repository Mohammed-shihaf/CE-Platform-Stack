import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { NotificationTaxSummaryEngine } from './domain/notifications/NotificationTaxSummaryEngine';
import { AlertDispatcherEngine, AlertMessage } from './domain/notifications/AlertDispatcherEngine';

const taxSummaryEngine = new NotificationTaxSummaryEngine();
const alertDispatcher = new AlertDispatcherEngine();

@Controller()
export class NotificationMicroserviceController {
  @MessagePattern({ cmd: 'format_tax_notification' })
  formatTaxNotification(data: { amount: number; state: string; isExempt: boolean }) {
    return taxSummaryEngine.computeTaxSettlement({
      baseAmount: data.amount,
      stateCode: data.state,
      isTaxExempt: data.isExempt,
      category: 'STANDARD'
    });
  }

  @MessagePattern({ cmd: 'dispatch_alerts' })
  dispatchAlerts(data: { alerts: AlertMessage[] }) {
    return alertDispatcher.dispatchAlerts(data.alerts);
  }
}

@Module({
  controllers: [NotificationMicroserviceController]
})
export class NotificationModule {}

export async function bootstrapNotification() {
  const app = await NestFactory.createMicroservice(NotificationModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 8876
    }
  });
  await app.listen();
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  bootstrapNotification().then(() => {
    console.log('[NotificationService] NestJS TCP Microservice listening on port 8876');
  });
}
