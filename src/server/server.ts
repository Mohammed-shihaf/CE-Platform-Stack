import express from 'express';
import cors from 'cors';
import { OrderController } from './controllers/OrderController';
import { BillingController } from './controllers/BillingController';
import { DiagnosticsController } from './controllers/DiagnosticsController';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const orderCtrl = new OrderController();
const billingCtrl = new BillingController();
const diagCtrl = new DiagnosticsController();

// Monolith REST API Endpoints
app.get('/api/orders/search', (req, res) => orderCtrl.searchOrders(req, res));
app.post('/api/orders/discount', (req, res) => orderCtrl.evaluateDiscount(req, res));
app.post('/api/billing/tax-alpha', (req, res) => billingCtrl.calculateTaxRegionA(req, res));
app.post('/api/billing/tax-beta', (req, res) => billingCtrl.calculateTaxRegionB(req, res));
app.get('/api/billing/download', (req, res) => billingCtrl.downloadInvoice(req, res));
app.get('/api/diagnostics/ping', (req, res) => diagCtrl.pingHost(req, res));

app.get('/health', (req, res) => {
  res.json({ service: 'ce-new-jsts-001-monolith', status: 'HEALTHY', arch: 'Monolith' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Enterprise Monolith listening at http://localhost:${port}`);
  });
}

export { app };
