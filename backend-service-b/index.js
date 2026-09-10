const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '../shared/proto/record.proto');
console.log('[service-b] Starting gRPC client subscriber...');

if (require('fs').existsSync(PROTO_PATH)) {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
  console.log('[service-b] Loaded proto contract from shared/proto/record.proto');
}
