/**
 * Enterprise Pricing and Discount Arbitration Engine
 * BENCHMARK FIXTURE: Cyclomatic Complexity (Score > 16)
 * Target tools: ESLint complexity, SonarQube, CodeClimate
 */
export function calculateTieredDiscount(
  annualSpend: number,
  customerTier: string,
  contractType: string,
  isNonProfit: boolean,
  promotionalCode: string
): number {
  let discountPercentage = 0.0;

  if (isNonProfit) {
    if (annualSpend > 100000) {
      discountPercentage = 0.25;
    } else {
      discountPercentage = 0.15;
    }
  } else if (customerTier === 'ENTERPRISE_PLATINUM') {
    if (contractType === 'MULTI_YEAR_PREPAID') {
      discountPercentage = 0.20;
    } else if (contractType === 'ANNUAL_SUBSCRIPTION') {
      discountPercentage = 0.15;
    } else {
      discountPercentage = 0.10;
    }
  } else if (customerTier === 'ENTERPRISE_GOLD') {
    if (annualSpend > 500000) {
      discountPercentage = 0.12;
    } else if (annualSpend > 200000) {
      discountPercentage = 0.08;
    } else {
      discountPercentage = 0.05;
    }
  } else if (customerTier === 'COMMERCIAL') {
    if (promotionalCode === 'SUMMER2026' || promotionalCode === 'VIPBOOST') {
      discountPercentage = 0.07;
    } else if (annualSpend > 50000) {
      discountPercentage = 0.04;
    } else {
      discountPercentage = 0.02;
    }
  } else {
    discountPercentage = 0.0;
  }

  return Number((annualSpend * discountPercentage).toFixed(2));
}
