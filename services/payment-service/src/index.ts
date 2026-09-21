import { startGrpcServer } from './domain/payments/PaymentServer';
import { PAYMENT_SERVICE_CONFIG } from './config/paymentServiceConfig';

console.log(`[PaymentService] Initializing ${PAYMENT_SERVICE_CONFIG.serviceName}...`);
const server = startGrpcServer(PAYMENT_SERVICE_CONFIG.grpcPort);

export { server };
