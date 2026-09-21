import express from 'express';
import cors from 'cors';
import { RolePermissionsEngine } from './domain/roles/RolePermissionsEngine';
import { AccessPolicyEngine } from './domain/policy/AccessPolicyEngine';
import { diagnosticsRouter } from './controllers/DiagnosticsController';
import { AUTH_CONFIG } from './config/authConfig';

const app = express();
app.use(cors());
app.use(express.json());

const roleEngine = new RolePermissionsEngine();
const policyEngine = new AccessPolicyEngine();

app.use('/api/diagnostics', diagnosticsRouter);

app.post('/api/auth/evaluate-role', (req, res) => {
  const result = roleEngine.evaluateAccess(req.body);
  res.json({ result });
});

app.post('/api/auth/check-policy', (req, res) => {
  const { tenant, action, clearance, requiresMfa, mfaVerified } = req.body;
  const outcome = policyEngine.checkPolicyRule(tenant, action, clearance, requiresMfa, mfaVerified);
  res.json({ outcome });
});

app.get('/health', (req, res) => {
  res.json({ service: AUTH_CONFIG.serviceName, status: 'HEALTHY' });
});

const PORT = AUTH_CONFIG.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[AuthService] Listening on port ${PORT}`);
  });
}

export { app };
