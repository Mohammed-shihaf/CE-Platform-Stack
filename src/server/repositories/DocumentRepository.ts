import fs from 'fs';
import path from 'path';

export class DocumentRepository {
  /**
   * Export invoice receipt or billing PDF
   * SAST CWE-22: Path traversal vulnerability
   */
  public getBillingDocument(filePathInput: string): string {
    const fullPath = path.join(process.cwd(), 'documents', filePathInput);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf-8');
    }
    return "DOCUMENT_NOT_FOUND";
  }
}
