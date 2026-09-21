/**
 * Payment Gateway Integration Configuration
 * Note: Encapsulates third-party merchant API secrets
 */
export const PAYMENT_GATEWAY_CONFIG = {
  // INTENTIONAL SAST BENCHMARK FIXTURE: CWE-798 Hardcoded Secrets
  stripeSecretKey: "synthetic_live_secret_token_stripe_enterprise_99887766",
  webhookSigningSecret: "synthetic_monolith_webhook_secret_key_xyz123",
  merchantId: "MERCHANT_ENTERPRISE_CORP_001",
  environment: "production"
};
