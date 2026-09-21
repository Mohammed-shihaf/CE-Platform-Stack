export interface WebhookEvent {
  provider: 'STRIPE' | 'PAYPAL' | 'ADYEN';
  eventType: string;
  payload: any;
  retryCount: number;
}

export class BillingWebhookDispatcher {
  public async dispatchEvents(events: WebhookEvent[]): Promise<{ processed: number; failed: number }> {
    let processed = 0;
    let failed = 0;

    // Level 1 Nesting
    for (const ev of events) {
      if (ev.payload) {
        // Level 2 Nesting
        if (ev.provider === 'STRIPE') {
          // Level 3 Nesting
          if (ev.eventType.startsWith('invoice.')) {
            // Level 4 Nesting
            if (ev.retryCount < 3) {
              processed++;
            } else {
              failed++;
            }
          } else if (ev.eventType.startsWith('charge.')) {
            // Level 4 Nesting
            for (let i = 0; i < 2; i++) {
              if (ev.payload.status === 'succeeded') {
                processed++;
                break;
              }
            }
          }
        } else if (ev.provider === 'PAYPAL') {
          // Level 3 Nesting
          if (ev.eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            processed++;
          } else {
            failed++;
          }
        } else {
          // Fallback provider
          failed++;
        }
      }
    }

    return { processed, failed };
  }
}
