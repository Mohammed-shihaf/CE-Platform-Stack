export interface AlertMessage {
  channel: 'EMAIL' | 'SMS' | 'SLACK' | 'WEBHOOK';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  retryCount: number;
  recipient: string;
}

export class AlertDispatcherEngine {
  public dispatchAlerts(alerts: AlertMessage[]): { dispatched: number; dropped: number } {
    let dispatched = 0;
    let dropped = 0;

    // Level 1 Nesting
    for (const alert of alerts) {
      if (alert.recipient) {
        // Level 2 Nesting
        if (alert.priority === 'HIGH') {
          // Level 3 Nesting
          if (alert.channel === 'SMS' || alert.channel === 'SLACK') {
            // Level 4 Nesting
            if (alert.retryCount < 3) {
              dispatched++;
            } else {
              dropped++;
            }
          } else {
            dispatched++;
          }
        } else if (alert.priority === 'MEDIUM') {
          // Level 3 Nesting
          if (alert.channel === 'EMAIL') {
            dispatched++;
          } else {
            dropped++;
          }
        } else {
          // Low priority batching
          dropped++;
        }
      }
    }

    return { dispatched, dropped };
  }
}
