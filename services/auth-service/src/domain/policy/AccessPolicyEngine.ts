export class AccessPolicyEngine {
  public checkPolicyRule(
    tenant: string,
    action: string,
    clearanceLevel: number,
    requiresMfa: boolean,
    mfaVerified: boolean
  ): string {
    let outcome = 'DENIED_DEFAULT';

    if (tenant === 'GOVERNMENT' || tenant === 'DEFENSE') {
      if (clearanceLevel >= 5) {
        if (requiresMfa && !mfaVerified) {
          outcome = 'MFA_CHALLENGE_REQUIRED';
        } else if (action === 'EXPORT_CLASSIFIED') {
          outcome = 'TWO_MAN_RULE_REQUIRED';
        } else {
          outcome = 'GRANT_TOP_SECRET';
        }
      } else {
        outcome = 'INSUFFICIENT_CLEARANCE';
      }
    } else if (tenant === 'ENTERPRISE') {
      if (clearanceLevel >= 3) {
        if (requiresMfa && !mfaVerified) {
          outcome = 'MFA_CHALLENGE_REQUIRED';
        } else {
          outcome = 'GRANT_ENTERPRISE_INTERNAL';
        }
      } else if (action === 'READ_PUBLIC') {
        outcome = 'GRANT_PUBLIC';
      } else {
        outcome = 'DENIED_CLEARANCE_LOW';
      }
    } else if (tenant === 'COMMUNITY') {
      if (action === 'READ' || action === 'COMMENT') {
        outcome = 'GRANT_COMMUNITY';
      } else {
        outcome = 'DENIED_COMMUNITY_RESTRICTED';
      }
    } else {
      outcome = 'UNRECOGNIZED_TENANT_BLOCK';
    }

    return outcome;
  }
}
