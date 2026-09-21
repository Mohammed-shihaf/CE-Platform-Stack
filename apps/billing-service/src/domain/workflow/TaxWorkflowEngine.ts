export class TaxWorkflowEngine {
  public evaluateTaxWorkflow(
    tier: string,
    volume: number,
    isCrossBorder: boolean,
    hasSpecialCert: boolean
  ): string {
    let pathway = 'STANDARD_DOMESTIC';

    if (tier === 'ENTERPRISE') {
      if (isCrossBorder) {
        if (hasSpecialCert) {
          pathway = 'CROSS_BORDER_TREATY_EXEMPT';
        } else if (volume > 100000) {
          pathway = 'CROSS_BORDER_HIGH_VOLUME_WITHHOLDING';
        } else {
          pathway = 'CROSS_BORDER_STANDARD_RECONCILIATION';
        }
      } else {
        if (volume > 50000) {
          pathway = 'DOMESTIC_ENTERPRISE_BATCH_AUDIT';
        } else {
          pathway = 'DOMESTIC_STANDARD_PRIORITY';
        }
      }
    } else if (tier === 'COMMERCIAL') {
      if (isCrossBorder && !hasSpecialCert) {
        pathway = 'COMMERCIAL_EXPORT_CLEARANCE_REQUIRED';
      } else if (volume > 20000) {
        pathway = 'COMMERCIAL_MID_TIER_PROCESSING';
      } else {
        pathway = 'COMMERCIAL_STANDARD_QUEUE';
      }
    } else if (tier === 'NON_PROFIT') {
      if (hasSpecialCert) {
        pathway = 'SECTION_501C3_FULL_RELIEF';
      } else {
        pathway = 'NON_PROFIT_PENDING_ATTESTATION';
      }
    } else {
      pathway = 'RETAIL_DEFAULT_SETTLEMENT';
    }

    return pathway;
  }
}
