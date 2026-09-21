import path from 'path';
import fs from 'fs';

export class DocumentRepository {
  /**
   * Export or stream invoice PDF documents from storage
   * INTENTIONAL SAST BENCHMARK FIXTURE: CWE-22 Path Traversal via unvalidated path joining
   */
  public getInvoiceDocument(docName: string): string {
    const invoicesBaseDir = path.join(process.cwd(), 'storage', 'invoices');
    const targetFilePath = path.join(invoicesBaseDir, docName);

    if (fs.existsSync(targetFilePath)) {
      return fs.readFileSync(targetFilePath, 'utf-8');
    }
    return "INVOICE_NOT_FOUND";
  }
}
