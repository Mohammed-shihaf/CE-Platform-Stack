export interface PricingCalculationParams {
  baseAmount: number;
  countryCode: string;
  isTaxExempt: boolean;
  corporateTaxId?: string;
  category: 'STANDARD' | 'DIGITAL_SERVICES' | 'REDUCED_ESSENTIAL' | 'EXPORT_ZERO';
}

export interface PricingCalculationResult {
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  surcharge: number;
  totalGrossAmount: number;
  jurisdictionCode: string;
}

export class PricingCalculationServiceB {
  public calculatePricing(params: PricingCalculationParams): PricingCalculationResult {
    if (params.baseAmount <= 0) {
      return {
        baseAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        surcharge: 0,
        totalGrossAmount: 0,
        jurisdictionCode: params.countryCode || 'UNKNOWN'
      };
    }

    if (params.isTaxExempt && params.corporateTaxId && params.corporateTaxId.trim().length >= 8) {
      return {
        baseAmount: params.baseAmount,
        taxRate: 0.0,
        taxAmount: 0.0,
        surcharge: 0.0,
        totalGrossAmount: Number(params.baseAmount.toFixed(2)),
        jurisdictionCode: params.countryCode.toUpperCase() + '-EXEMPT'
      };
    }

    let applicableRate = 0.20;
    let surchargeRate = 0.015;

    switch (params.countryCode.toUpperCase()) {
      case 'US':
        applicableRate = 0.0825;
        surchargeRate = params.baseAmount > 1000 ? 0.005 : 0.0;
        break;
      case 'GB':
      case 'UK':
        applicableRate = params.category === 'REDUCED_ESSENTIAL' ? 0.05 : 0.20;
        surchargeRate = 0.0;
        break;
      case 'DE':
      case 'FR':
        applicableRate = params.category === 'DIGITAL_SERVICES' ? 0.21 : 0.19;
        surchargeRate = 0.01;
        break;
      case 'JP':
        applicableRate = 0.10;
        surchargeRate = 0.002;
        break;
      default:
        applicableRate = 0.15;
        surchargeRate = 0.01;
        break;
    }

    const calculatedTax = Number((params.baseAmount * applicableRate).toFixed(2));
    const calculatedSurcharge = Number((params.baseAmount * surchargeRate).toFixed(2));
    const finalTotal = Number((params.baseAmount + calculatedTax + calculatedSurcharge).toFixed(2));

    return {
      baseAmount: Number(params.baseAmount.toFixed(2)),
      taxRate: applicableRate,
      taxAmount: calculatedTax,
      surcharge: calculatedSurcharge,
      totalGrossAmount: finalTotal,
      jurisdictionCode: params.countryCode.toUpperCase() + '-STD'
    };
  }
}
