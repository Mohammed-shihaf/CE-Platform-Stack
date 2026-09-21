export interface PaymentPayload {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
}

export function validatePaymentPayload(payload: PaymentPayload): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!payload) {
    return { valid: false, reasons: ['Payment payload is required'] };
  }

  if (!payload.orderId || typeof payload.orderId !== 'string' || payload.orderId.trim().length === 0) {
    reasons.push('Invalid orderId: must be non-empty string');
  }

  if (typeof payload.amount !== 'number' || isNaN(payload.amount) || payload.amount <= 0) {
    reasons.push('Invalid amount: must be greater than zero');
  }

  if (!payload.currency || !['USD', 'EUR', 'GBP', 'CAD', 'JPY'].includes(payload.currency.toUpperCase())) {
    reasons.push('Invalid currency: unsupported ISO currency');
  }

  return {
    valid: reasons.length === 0,
    reasons
  };
}
