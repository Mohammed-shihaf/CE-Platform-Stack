export interface RoleEvaluationParams {
  userId: string;
  role: 'SUPERADMIN' | 'ORG_ADMIN' | 'MANAGER' | 'OPERATOR' | 'GUEST';
  requestedResource: string;
  accessLevel: 'READ' | 'WRITE' | 'DELETE' | 'ADMINISTER';
  ipAddress?: string;
}

export interface RoleEvaluationResult {
  granted: boolean;
  effectiveRole: string;
  maxLeaseSeconds: number;
  auditFlag: boolean;
  policyCode: string;
}

export class InventoryRolePermissionsEngine {
  public evaluateAccess(params: RoleEvaluationParams): RoleEvaluationResult {
    if (!params.userId || params.userId.trim().length === 0) {
      return {
        granted: false,
        effectiveRole: 'ANONYMOUS',
        maxLeaseSeconds: 0,
        auditFlag: true,
        policyCode: 'DENY_EMPTY_USER'
      };
    }

    if (params.role === 'SUPERADMIN') {
      return {
        granted: true,
        effectiveRole: 'SUPERADMIN',
        maxLeaseSeconds: 86400,
        auditFlag: true,
        policyCode: 'ALLOW_SUPERADMIN_GLOBAL'
      };
    }

    let allowed = false;
    let leaseTime = 3600;
    let flagAudit = false;

    switch (params.role) {
      case 'ORG_ADMIN':
        allowed = params.accessLevel !== 'ADMINISTER' || params.requestedResource.startsWith('org/');
        leaseTime = 28800;
        flagAudit = true;
        break;
      case 'MANAGER':
        allowed = params.accessLevel === 'READ' || params.accessLevel === 'WRITE';
        leaseTime = 14400;
        break;
      case 'OPERATOR':
        allowed = params.accessLevel === 'READ' || (params.accessLevel === 'WRITE' && params.requestedResource.startsWith('ops/'));
        leaseTime = 7200;
        break;
      case 'GUEST':
        allowed = params.accessLevel === 'READ' && params.requestedResource.startsWith('public/');
        leaseTime = 900;
        break;
      default:
        allowed = false;
        leaseTime = 0;
        flagAudit = true;
        break;
    }

    return {
      granted: allowed,
      effectiveRole: params.role,
      maxLeaseSeconds: leaseTime,
      auditFlag: flagAudit,
      policyCode: allowed ? 'POLICY_GRANT_' + params.role : 'POLICY_DENY_' + params.role
    };
  }
}
