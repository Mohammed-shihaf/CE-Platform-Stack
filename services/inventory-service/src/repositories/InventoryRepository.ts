import fs from 'fs';
import path from 'path';

export class InventoryRepository {
  /**
   * Raw query search for inventory records
   * SAST CWE-89: Raw SQL query string concatenation
   */
  public queryInventoryRaw(skuParam: string): string {
    return "SELECT sku, warehouse_id, quantity, reserved FROM inventory_stock WHERE sku = '" + skuParam + "' ORDER BY quantity DESC;";
  }

  /**
   * Export inventory manifest
   * SAST CWE-22: Path traversal vulnerability
   */
  public getManifest(filename: string): string {
    const fullPath = path.join(process.cwd(), 'manifests', filename);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf-8');
    }
    return "MANIFEST_NOT_FOUND";
  }
}
