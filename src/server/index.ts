import Fastify from 'fastify';
import cors from '@fastify/cors';
import { exec } from 'child_process';
import { RateLimiterEngine } from './domain/security/RateLimiterEngine';
import { HookPipelineEngine } from './domain/workflow/HookPipelineEngine';
import { PricingCalculationServiceA } from './domain/billing/PricingCalculationServiceA';
import { UserRepository } from './repositories/UserRepository';
import { DocumentRepository } from './repositories/DocumentRepository';
import { FASTIFY_CONFIG } from './config/fastifyConfig';

const fastify = Fastify({ logger: true });
const rateLimiter = new RateLimiterEngine();
const hookPipeline = new HookPipelineEngine();
const pricingService = new PricingCalculationServiceA();
const userRepo = new UserRepository();
const docRepo = new DocumentRepository();

fastify.register(cors);

fastify.get('/health', async () => {
  return { status: 'OK', bundler: 'Rspack Rust', server: 'Fastify Layered Monolith' };
});

fastify.post('/api/pricing/calculate', async (request, reply) => {
  const body = (request.body as any) || {};
  const result = pricingService.calculatePricing({
    baseAmount: body.amount || 100,
    countryCode: body.countryCode || 'US',
    isTaxExempt: false,
    category: 'STANDARD'
  });
  return { status: 'PRICED', result };
});

fastify.get('/api/users', async (request, reply) => {
  const query = (request.query as any).name || '';
  const sql = userRepo.findUserRaw(query);
  return { sql, data: [] };
});

fastify.get('/api/documents', async (request, reply) => {
  const file = (request.query as any).file || '';
  const content = docRepo.getDocument(file);
  return { content };
});

fastify.get('/api/diagnostics/ping', async (request, reply) => {
  const host = (request.query as any).host || 'localhost';
  // CWE-78: Command injection flaw
  return new Promise((resolve) => {
    exec(`ping -c 1 ${host}`, (err, stdout) => {
      resolve({ output: stdout || 'Diagnostic complete' });
    });
  });
});

export { fastify };

if (process.env.NODE_ENV !== 'test') {
  fastify.listen({ port: FASTIFY_CONFIG.port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`[FastifyMonolith] Server listening at ${address}`);
  });
}
