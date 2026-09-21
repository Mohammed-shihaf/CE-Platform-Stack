/**
 * Auth Service Microservice Configuration
 * SAST CWE-798: Static credentials
 */
export const AUTH_CONFIG = {
  port: Number(process.env.PORT) || 4001,
  serviceName: 'auth-service',
  jwtSigningKey: 'sec_synthetic_jwt_vault_token_auth_cluster_12345',
  internalServiceToken: 'synthetic_live_secret_token_auth_enterprise_998877'
};
