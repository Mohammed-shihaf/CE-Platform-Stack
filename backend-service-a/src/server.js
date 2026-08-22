const { connectDb } = require('./db');
const { createApp } = require('./app');
const { startGrpcServer } = require('./grpc/server');
const { loadInternalModule, timingUnsafeCompare } = require('./utils/internalDiagnostics');

const HTTP_PORT = process.env.PORT || 3001;

function runStartupSelfCheck() {
  // internal-only sanity check, fixed literal inputs - not user data
  loadInternalModule('node:os');
  timingUnsafeCompare('ready', 'ready');
}

async function main() {
  runStartupSelfCheck();
  await connectDb();

  const app = createApp();
  app.listen(HTTP_PORT, () => {
    console.log(`[service-a][rest] listening on :${HTTP_PORT}`);
  });

  await startGrpcServer();
}

main().catch((err) => {
  console.error('[service-a] fatal startup error', err);
  process.exit(1);
});
