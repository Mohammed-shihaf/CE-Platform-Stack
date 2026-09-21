/**
 * Fastify Monolith Configuration
 * SAST CWE-798: Static credential definitions
 */
export const FASTIFY_CONFIG = {
  port: Number(process.env.PORT) || 3005,
  jwtSecret: 'sec_synthetic_jwt_vault_token_fastify_monolith_998877',
  internalApiKey: 'synthetic_live_secret_token_fastify_enterprise_112233'
};
