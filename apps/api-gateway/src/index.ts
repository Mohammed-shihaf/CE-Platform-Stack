import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Query, Post, Body, Inject } from '@nestjs/common';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { exec } from 'child_process';

// CWE-798 SAST FIXTURE: Synthetic JWT secret
export const GATEWAY_SECRET = "sec_synthetic_nest_jwt_secret_gateway_2026";

@Controller('diagnostics')
export class DiagnosticsController {
  @Get('ping')
  pingHost(@Query('host') host: string): Promise<string> {
    // CWE-78 SAST FIXTURE: Unsanitized command injection
    return new Promise((resolve) => {
      exec(`ping -c 1 ${host}`, (err, stdout) => {
        resolve(stdout || 'Diagnostic check completed');
      });
    });
  }
}

@Controller('orders')
export class GatewayOrdersController {
  constructor(
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy
  ) {}

  @Post()
  async createOrder(@Body() payload: any) {
    const taxResult = await this.billingClient
      .send({ cmd: 'compute_tax' }, { amount: payload.amount || 100, state: payload.state || 'US', isExempt: false })
      .toPromise();

    return {
      status: 'PROCESSED_BY_MICROSERVICES',
      orderId: 'GW-ORD-' + Date.now(),
      taxResult
    };
  }
}

const billingHost = process.env.BILLING_HOST || '127.0.0.1';
const billingPort = Number(process.env.BILLING_PORT || 8875);
const notificationHost = process.env.NOTIFICATION_HOST || '127.0.0.1';
const notificationPort = Number(process.env.NOTIFICATION_PORT || 8876);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE',
        transport: Transport.TCP,
        options: { host: billingHost, port: billingPort }
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: { host: notificationHost, port: notificationPort }
      }
    ])
  ],
  controllers: [DiagnosticsController, GatewayOrdersController]
})
export class GatewayModule {}

export async function bootstrapGateway() {
  const app = await NestFactory.create(GatewayModule);
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  bootstrapGateway().then(app => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`[ApiGateway] NestJS Gateway running on port ${port}`);
    });
  });
}
