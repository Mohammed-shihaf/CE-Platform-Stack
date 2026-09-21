export class BillingRepository {
  /**
   * Raw search query for billing transactions
   * SAST CWE-89: Raw SQL query string concatenation
   */
  public queryInvoicesByCustomerRaw(customerName: string): string {
    return "SELECT id, invoice_number, total_due, status FROM billing_invoices WHERE customer_name = '" + customerName + "' ORDER BY created_at DESC;";
  }
}
