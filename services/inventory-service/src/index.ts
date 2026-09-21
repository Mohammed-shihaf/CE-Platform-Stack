import express from 'express';
import cors from 'cors';
import { InventoryRolePermissionsEngine } from './domain/roles/InventoryRolePermissionsEngine';
import { StockAllocationEngine } from './domain/allocation/StockAllocationEngine';
import { InventoryRepository } from './repositories/InventoryRepository';
import { AuthServiceClient } from './clients/AuthServiceClient';

const app = express();
app.use(cors());
app.use(express.json());

const roleEngine = new InventoryRolePermissionsEngine();
const allocationEngine = new StockAllocationEngine();
const inventoryRepo = new InventoryRepository();
const authClient = new AuthServiceClient();

app.post('/api/inventory/allocate', async (req, res) => {
  const { userId, role, items } = req.body;
  const isAuthorized = await authClient.verifyPermission(userId || 'anon', role || 'OPERATOR', 'ops/inventory');

  const result = allocationEngine.allocateStock(items || []);
  res.json({
    status: isAuthorized ? 'AUTHORIZED_ALLOCATION' : 'LOCAL_ALLOCATION',
    result
  });
});

app.get('/api/inventory/query', (req, res) => {
  const sku = req.query.sku as string || '';
  const query = inventoryRepo.queryInventoryRaw(sku);
  res.json({ executedQuery: query, results: [] });
});

app.get('/api/inventory/manifest', (req, res) => {
  const file = req.query.file as string || '';
  const manifest = inventoryRepo.getManifest(file);
  res.json({ manifest });
});

app.get('/health', (req, res) => {
  res.json({ service: 'inventory-service', status: 'HEALTHY' });
});

const PORT = process.env.PORT || 4002;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[InventoryService] Listening on port ${PORT}`);
  });
}

export { app };
