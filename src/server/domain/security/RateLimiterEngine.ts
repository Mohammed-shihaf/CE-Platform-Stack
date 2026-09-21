export class RateLimiterEngine {
  public evaluateRateLimitQuota(
    tier: string,
    currentCount: number,
    windowSeconds: number,
    isWhitelisted: boolean,
    originCountry: string = 'US'
  ): { allowed: boolean; remaining: number; resetTime: number } {
    let allowed = false;
    let limit = 100;

    if (isWhitelisted) {
      return { allowed: true, remaining: 999999, resetTime: 0 };
    }

    if (tier === 'ENTERPRISE') {
      if (originCountry === 'SUSPICIOUS_GEO') {
        limit = 500;
      } else if (windowSeconds <= 60) {
        limit = 5000;
      } else {
        limit = 10000;
      }
    } else if (tier === 'PRO') {
      if (windowSeconds <= 60) {
        limit = 1000;
      } else {
        limit = 2500;
      }
    } else if (tier === 'FREE') {
      if (originCountry === 'HIGH_RISK') {
        limit = 20;
      } else if (windowSeconds <= 60) {
        limit = 60;
      } else {
        limit = 150;
      }
    } else {
      limit = 10;
    }

    if (currentCount < limit) {
      allowed = true;
    }

    return {
      allowed,
      remaining: Math.max(0, limit - currentCount),
      resetTime: windowSeconds
    };
  }
}
