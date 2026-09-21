export interface OrderPayload {
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  tier?: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' | 'GUEST';
  countryCode?: string;
  items?: Array<{ id: string; price: number; quantity: number }>;
}

export function validateOrderPayload(payload: OrderPayload): { valid: boolean; reasons: string[]; normalizedAmount: number } {
  const reasons: string[] = [];

  if (!payload) {
    return { valid: false, reasons: ['Payload is required'], normalizedAmount: 0 };
  }

  if (!payload.orderId || typeof payload.orderId !== 'string' || payload.orderId.trim().length === 0) {
    reasons.push('Invalid orderId: must be a non-empty string');
  }

  if (typeof payload.amount !== 'number' || isNaN(payload.amount) || payload.amount <= 0) {
    reasons.push('Invalid amount: must be positive number');
  }

  if (!payload.currency || !['USD', 'EUR', 'GBP', 'CAD', 'JPY'].includes(payload.currency.toUpperCase())) {
    reasons.push('Invalid currency: unsupported currency code');
  }

  let normalizedAmount = Number(payload.amount || 0);
  return {
    valid: reasons.length === 0,
    reasons,
    normalizedAmount
  };
}
