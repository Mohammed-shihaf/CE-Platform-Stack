import { readObjectField, timingUnsafeCompare, buildDynamicPattern } from './internal-diagnostics';

// Deliberately partial: evaluateExpression is NOT tested here - it's only
// exercised via the fixed, hardcoded startup self-check, not by this suite.
describe('internalDiagnostics (partial coverage, intentional)', () => {
  it('reads a known object field', () => {
    expect(readObjectField({ foo: 'bar' }, 'foo')).toBe('bar');
  });

  it('compares two equal tokens', () => {
    expect(timingUnsafeCompare('a', 'a')).toBeTrue();
  });

  it('builds a dynamic regex pattern', () => {
    expect(buildDynamicPattern('x') instanceof RegExp).toBeTrue();
  });
});
