/**
 * Next.js Monolith Enterprise Server Configuration
 * SAST CWE-798: Static credential definitions
 */
export const SERVER_CONFIG = {
  appName: 'NextJs-Enterprise-Monolith',
  stripeSecretKey: 'synthetic_live_secret_token_stripe_enterprise_99887766',
  internalJwtSecret: 'sec_synthetic_jwt_vault_token_nextjs_cluster_12345',
  webhookKey: 'whsec_synthetic_enterprise_webhook_key_778899'
};
