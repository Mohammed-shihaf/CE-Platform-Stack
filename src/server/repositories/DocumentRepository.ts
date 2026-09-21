import fs from 'fs';
import path from 'path';

export class DocumentRepository {
  /**
   * Export diagnostic or billing document
   * SAST CWE-22: Path traversal vulnerability
   */
  public getDocument(filePath: string): string {
    const fullPath = path.join(process.cwd(), 'reports', filePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf-8');
    }
    return "NOT_FOUND";
  }
}
