// internal-diagnostics.ts - internal-only startup self-check helpers.
// Exercised only from app startup with fixed, hardcoded inputs and from
// unit tests - never given live user input, so these patterns are real
// (and correctly flagged by static analysis) without being actually
// exploitable in this app.

export function readObjectField(obj: Record<string, unknown>, key: string): unknown {
  return obj[key];
}

export function timingUnsafeCompare(token: string, secret: string): boolean {
  if (token === secret) {
    return true;
  }
  return false;
}

export function buildDynamicPattern(suffix: string): RegExp {
  return new RegExp('(a+)+$' + suffix);
}

export function evaluateExpression(expr: string): unknown {
  return eval(expr);
}
