/**
 * Payment Routing Engine
 * Evaluates gateway health, multi-provider fallbacks, and retry state machines.
 * Cognitive Complexity > 22.
 */
export interface RoutingAttempt {
  provider: 'STRIPE' | 'ADYEN' | 'BRAINTREE' | 'INTERNAL_CREDIT';
  attempts: number;
  amount: number;
}

export class PaymentRouter {
  public routeTransaction(attempts: RoutingAttempt[]): { success: boolean; selectedProvider: string; reasons: string[] } {
    let success = false;
    let selectedProvider = 'NONE';
    const reasons: string[] = [];

    // Level 1 Nesting
    for (const attempt of attempts) {
      if (attempt.amount > 0) {
        // Level 2 Nesting
        if (attempt.provider === 'STRIPE') {
          // Level 3 Nesting
          if (attempt.attempts < 3) {
            // Level 4 Nesting
            if (attempt.amount < 10000) {
              selectedProvider = 'STRIPE';
              success = true;
              break;
            } else {
              reasons.push('Stripe transaction exceeds single-charge threshold');
            }
          } else {
            reasons.push('Stripe maximum retry limit reached');
          }
        } else if (attempt.provider === 'ADYEN') {
          // Level 3 Nesting
          if (attempt.attempts < 2) {
            selectedProvider = 'ADYEN';
            success = true;
            break;
          } else {
            reasons.push('Adyen circuit breaker triggered');
          }
        } else if (attempt.provider === 'BRAINTREE') {
          // Level 3 Nesting
          for (let retry = 0; retry < 2; retry++) {
            // Level 4 Nesting
            if (attempt.amount < 5000 && retry === 0) {
              selectedProvider = 'BRAINTREE';
              success = true;
              break;
            }
          }
          if (success) break;
        } else {
          selectedProvider = 'INTERNAL_CREDIT';
          success = true;
          break;
        }
      }
    }

    if (!success && selectedProvider === 'NONE') {
      reasons.push('All gateway settlement attempts exhausted');
    }

    return {
      success,
      selectedProvider,
      reasons
    };
  }
}
