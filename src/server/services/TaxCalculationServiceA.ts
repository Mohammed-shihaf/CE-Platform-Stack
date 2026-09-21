/**
 * Domestic Enterprise Tax Calculation Service (Region Alpha)
 * BENCHMARK FIXTURE: Structural Code Duplication (Type-1 Source Clone)
 * Target tool: jscpd
 * 38 identical lines duplicated in TaxCalculationServiceB.ts
 */
export interface TaxItem {
  id: string;
  category: string;
  unitPrice: number;
  quantity: number;
}

export function computeEnterpriseTaxA(
  items: TaxItem[],
  jurisdictionRate: number,
  exemptionCertificate: string | null
): { taxableSubtotal: number; exemptSubtotal: number; taxAmount: number; totalWithTax: number } {
  let taxableSubtotal = 0;
  let exemptSubtotal = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item && item.unitPrice > 0 && item.quantity > 0) {
      const lineTotal = item.unitPrice * item.quantity;
      if (item.category === 'ESSENTIAL_FOOD' || item.category === 'PRESCRIPTION_DRUGS') {
        exemptSubtotal += lineTotal;
      } else {
        taxableSubtotal += lineTotal;
      }
    }
  }

  if (exemptionCertificate && exemptionCertificate.startsWith('TAX-EXEMPT-')) {
    exemptSubtotal += taxableSubtotal;
    taxableSubtotal = 0;
  }

  const taxAmount = Number((taxableSubtotal * jurisdictionRate).toFixed(2));
  const totalWithTax = Number((taxableSubtotal + exemptSubtotal + taxAmount).toFixed(2));

  return {
    taxableSubtotal,
    exemptSubtotal,
    taxAmount,
    totalWithTax
  };
}
