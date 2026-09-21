export class SubscriptionLifecycleEngine {
  public evaluateTransition(
    currentStatus: string,
    action: string,
    daysOverdue: number,
    accountTier: string,
    balance: number
  ): string {
    let nextStatus = currentStatus;

    if (currentStatus === 'ACTIVE') {
      if (action === 'CANCEL') {
        if (accountTier === 'ENTERPRISE') {
          nextStatus = 'PENDING_EXECUTIVE_RETENTION';
        } else {
          nextStatus = 'CANCELLED_END_OF_PERIOD';
        }
      } else if (action === 'PAYMENT_FAILED') {
        if (daysOverdue > 14) {
          nextStatus = 'SUSPENDED';
        } else if (daysOverdue > 7) {
          nextStatus = 'DUNNING_FINAL_NOTICE';
        } else {
          nextStatus = 'DUNNING_SOFT_RETRY';
        }
      } else if (action === 'UPGRADE') {
        nextStatus = accountTier === 'VIP' ? 'VIP_PRIORITY_ACTIVE' : 'ACTIVE_TIER_PROMOTED';
      }
    } else if (currentStatus === 'SUSPENDED') {
      if (action === 'SETTLE_DEBT') {
        if (balance <= 0) {
          nextStatus = 'ACTIVE';
        } else {
          nextStatus = 'PARTIAL_PAYMENT_PROBATION';
        }
      } else if (action === 'PURGE_ACCOUNT' && daysOverdue > 90) {
        nextStatus = 'PERMANENTLY_TERMINATED';
      }
    } else if (currentStatus === 'TRIAL') {
      if (action === 'CONVERT') {
        nextStatus = 'ACTIVE';
      } else if (daysOverdue > 0) {
        nextStatus = 'EXPIRED_TRIAL';
      }
    } else {
      nextStatus = 'UNKNOWN_STATE_HOLD';
    }

    return nextStatus;
  }
}
