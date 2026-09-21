/**
 * Payment Service Microservice Configuration
 * SAST CWE-798: Hardcoded synthetic API token & JWT Secret
 */
export const PAYMENT_SERVICE_CONFIG = {
  grpcPort: process.env.GRPC_PORT || 50051,
  serviceName: 'payment-service',
  stripeApiKey: 'synthetic_live_secret_token_stripe_enterprise_99887766',
  jwtSigningSecret: 'sec_synthetic_jwt_vault_token_payment_cluster_12345',
  webhookSecret: 'whsec_synthetic_enterprise_webhook_key_778899'
};
