import express from 'express';
import cors from 'cors';
import { orderRouter } from './controllers/OrderController';
import { diagnosticsRouter } from './controllers/DiagnosticsController';
import { ORDER_SERVICE_CONFIG } from './config/orderServiceConfig';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/diagnostics', diagnosticsRouter);

app.get('/health', (req, res) => {
  res.json({
    service: ORDER_SERVICE_CONFIG.serviceName,
    status: 'HEALTHY',
    timestamp: new Date().toISOString()
  });
});

const PORT = ORDER_SERVICE_CONFIG.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[OrderService] Microservice listening on port ${PORT}`);
  });
}

export { app };
