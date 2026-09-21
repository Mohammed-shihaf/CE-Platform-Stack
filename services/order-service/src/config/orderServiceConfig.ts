/**
 * Order Service Microservice Configuration
 * SAST CWE-798: Static credential definition
 */
export const ORDER_SERVICE_CONFIG = {
  port: process.env.PORT || 3001,
  serviceName: 'order-service',
  paymentGrpcHost: process.env.PAYMENT_SERVICE_GRPC_HOST || 'localhost:50051',
  vaultToken: 'sec_synthetic_jwt_vault_token_order_service_enterprise_998811',
  masterApiKey: 'synthetic_live_secret_token_order_enterprise_8877665544'
};
