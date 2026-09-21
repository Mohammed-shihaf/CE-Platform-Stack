import { describe, it, expect } from 'vitest';
import { RolePermissionsEngine } from '../src/domain/roles/RolePermissionsEngine';
import { AccessPolicyEngine } from '../src/domain/policy/AccessPolicyEngine';

describe('Auth Microservice Domain Tests', () => {
  const roleEngine = new RolePermissionsEngine();
  const policyEngine = new AccessPolicyEngine();

  it('evaluates superadmin access grant', () => {
    const res = roleEngine.evaluateAccess({
      userId: 'usr_super',
      role: 'SUPERADMIN',
      requestedResource: 'admin/cluster',
      accessLevel: 'ADMINISTER'
    });
    expect(res.granted).toBe(true);
    expect(res.maxLeaseSeconds).toBe(86400);
  });

  it('evaluates manager read/write permissions', () => {
    const res = roleEngine.evaluateAccess({
      userId: 'usr_mgr',
      role: 'MANAGER',
      requestedResource: 'billing/invoices',
      accessLevel: 'WRITE'
    });
    expect(res.granted).toBe(true);
  });

  it('evaluates enterprise policy clearance', () => {
    const outcome = policyEngine.checkPolicyRule('ENTERPRISE', 'READ_INTERNAL', 4, false, false);
    expect(outcome).toBe('GRANT_ENTERPRISE_INTERNAL');
  });

  it('enforces MFA for sensitive enterprise access', () => {
    const outcome = policyEngine.checkPolicyRule('ENTERPRISE', 'MODIFY_FINANCE', 4, true, false);
    expect(outcome).toBe('MFA_CHALLENGE_REQUIRED');
  });
});
