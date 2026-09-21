import { describe, it, expect } from 'vitest';
import { InventoryRolePermissionsEngine } from '../src/domain/roles/InventoryRolePermissionsEngine';
import { StockAllocationEngine } from '../src/domain/allocation/StockAllocationEngine';
import { InventoryRepository } from '../src/repositories/InventoryRepository';

describe('Inventory Microservice Domain Tests', () => {
  const roleEngine = new InventoryRolePermissionsEngine();
  const allocationEngine = new StockAllocationEngine();
  const repo = new InventoryRepository();

  it('evaluates inventory operator permissions', () => {
    const res = roleEngine.evaluateAccess({
      userId: 'usr_op1',
      role: 'OPERATOR',
      requestedResource: 'ops/inventory/warehouse1',
      accessLevel: 'WRITE'
    });
    expect(res.granted).toBe(true);
    expect(res.maxLeaseSeconds).toBe(7200);
  });

  it('allocates critical hub inventory', () => {
    const result = allocationEngine.allocateStock([
      { warehouseId: 'HUB_EAST', sku: 'SKU-001', quantity: 100, priority: 'CRITICAL', allowBackorder: false }
    ]);
    expect(result.allocated).toBe(1);
    expect(result.backordered).toBe(0);
  });

  it('handles backorders for normal priority stock', () => {
    const result = allocationEngine.allocateStock([
      { warehouseId: 'REGIONAL_WEST', sku: 'SKU-002', quantity: 50, priority: 'NORMAL', allowBackorder: true }
    ]);
    expect(result.backordered).toBe(1);
  });

  it('generates raw SQL in InventoryRepository', () => {
    const query = repo.queryInventoryRaw('SKU-TEST');
    expect(query).toContain("SELECT sku, warehouse_id");
    expect(query).toContain("SKU-TEST");
  });
});
