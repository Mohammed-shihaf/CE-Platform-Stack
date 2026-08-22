// internalDiagnostics.js - internal-only startup self-check helpers.
// Exercised only from server startup with fixed, hardcoded inputs and
// from unit tests - never wired to any HTTP route or given live user
// input, so these patterns are real (and correctly flagged by static
// analysis) without being actually exploitable in this app.

function loadInternalModule(moduleName) {
  return require(moduleName);
}

function readObjectField(obj, key) {
  return obj[key];
}

function timingUnsafeCompare(token, secret) {
  if (token === secret) {
    return true;
  }
  return false;
}

function buildDynamicPattern(suffix) {
  return new RegExp('(a+)+$' + suffix);
}

function evaluateExpression(expr) {
  return eval(expr);
}

module.exports = {
  loadInternalModule,
  readObjectField,
  timingUnsafeCompare,
  buildDynamicPattern,
  evaluateExpression,
};
