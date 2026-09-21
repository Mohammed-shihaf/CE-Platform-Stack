import { describe, it, expect } from 'vitest';
import { PricingCalculationServiceA } from '../src/server/domain/billing/PricingCalculationServiceA';
import { PricingCalculationServiceB } from '../src/server/domain/billing/PricingCalculationServiceB';
import { RateLimiterEngine } from '../src/server/domain/security/RateLimiterEngine';
import { HookPipelineEngine } from '../src/server/domain/workflow/HookPipelineEngine';
import { UserRepository } from '../src/server/repositories/UserRepository';

describe('Fastify Rspack Monolith Domain Tests', () => {
  const serviceA = new PricingCalculationServiceA();
  const serviceB = new PricingCalculationServiceB();
  const rateLimiter = new RateLimiterEngine();
  const hookPipeline = new HookPipelineEngine();
  const userRepo = new UserRepository();

  it('computes pricing settlement via Service A', () => {
    const res = serviceA.calculatePricing({
      baseAmount: 1000,
      countryCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxAmount).toBe(82.50);
    expect(res.totalGrossAmount).toBe(1082.50);
  });

  it('computes pricing settlement via Service B with parity', () => {
    const res = serviceB.calculatePricing({
      baseAmount: 1000,
      countryCode: 'US',
      isTaxExempt: false,
      category: 'STANDARD'
    });
    expect(res.taxAmount).toBe(82.50);
    expect(res.totalGrossAmount).toBe(1082.50);
  });

  it('evaluates rate limit quota for enterprise tier', () => {
    const quota = rateLimiter.evaluateRateLimitQuota('ENTERPRISE', 150, 60, false, 'US');
    expect(quota.allowed).toBe(true);
    expect(quota.remaining).toBeGreaterThan(4000);
  });

  it('executes hook pipeline on response phase', () => {
    const pipeline = hookPipeline.executePipeline({
      phase: 'ON_RESPONSE',
      pluginNames: ['audit_logger', 'security_guard'],
      payload: { valid: true },
      retryAttempt: 0
    });
    expect(pipeline.executed).toBe(2);
    expect(pipeline.failed).toBe(0);
  });

  it('generates raw SQL in UserRepository', () => {
    const sql = userRepo.findUserRaw('test_admin');
    expect(sql).toContain("SELECT * FROM fastify_users WHERE user_name = 'test_admin'");
  });
});
