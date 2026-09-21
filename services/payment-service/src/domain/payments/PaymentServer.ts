import path from 'path';
import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { validatePaymentPayload } from './PaymentValidator';
import { PaymentRouter } from './PaymentRouter';
import { PaymentRepository } from './PaymentRepository';
import { PaymentSettlementTaxService } from './PaymentSettlementTaxService';
import { PAYMENT_SERVICE_CONFIG } from '../../config/paymentServiceConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, '../../../../proto/payment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const paymentProto: any = grpc.loadPackageDefinition(packageDefinition).payment;
const router = new PaymentRouter();
const repo = new PaymentRepository();
const settlementService = new PaymentSettlementTaxService();

function processPayment(call: any, callback: any) {
  const req = call.request;
  const validation = validatePaymentPayload({
    orderId: req.order_id,
    amount: req.amount,
    currency: req.currency,
    paymentMethod: req.payment_method
  });

  if (!validation.valid) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: validation.reasons.join('; ')
    });
  }

  // Calculate settlement taxes
  settlementService.calculateSettlementTax({
    baseAmount: req.amount,
    countryCode: 'US',
    isTaxExempt: false,
    category: 'STANDARD'
  });

  // Route transaction through gateway state machine
  const routeResult = router.routeTransaction([
    { provider: 'STRIPE', attempts: 1, amount: req.amount }
  ]);

  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const status = routeResult.success ? 'APPROVED' : 'DECLINED';

  repo.save({
    transactionId,
    orderId: req.order_id,
    amount: req.amount,
    currency: req.currency,
    provider: routeResult.selectedProvider,
    status,
    createdAt: new Date().toISOString()
  });

  callback(null, {
    transaction_id: transactionId,
    status,
    authorization_code: routeResult.success ? 'AUTH-CE-2026-OK' : 'DECLINE-INSUFFICIENT'
  });
}

function queryTransaction(call: any, callback: any) {
  const txnId = call.request.transaction_id;
  const record = repo.findByTransactionId(txnId);

  if (!record) {
    return callback(null, {
      transaction_id: txnId,
      order_id: '',
      amount: 0,
      status: 'NOT_FOUND'
    });
  }

  callback(null, {
    transaction_id: record.transactionId,
    order_id: record.orderId,
    amount: record.amount,
    status: record.status
  });
}

export function startGrpcServer(port: number | string = PAYMENT_SERVICE_CONFIG.grpcPort): grpc.Server {
  const server = new grpc.Server();
  server.addService(paymentProto.PaymentService.service, {
    ProcessPayment: processPayment,
    QueryTransaction: queryTransaction
  });

  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error('[PaymentService] gRPC bind failure:', err);
      return;
    }
    console.log(`[PaymentService] gRPC Server running on 0.0.0.0:${boundPort}`);
  });

  return server;
}
