# CE-Platform-Stack — branch CE-JS-009

Testbed reference repository for validating a code-scanning platform against
a locked **Pure JavaScript** microservices technology stack.

This branch is part of the `CE-JS-001`..`CE-JS-010` dedicated JavaScript combination matrix (5 JS package managers/bundlers x 2 project structures):

| Branch | Runtime / Language | JS Package Manager | Project Structure |
|---|---|---|---|
| `CE-JS-009` | JavaScript (Node 22) | npm (esbuild/vite) | **Monolith** |

## Pure JavaScript Technology Baseline

All core technologies are genuinely wired and exercised on this branch:
- **Backend Service A (JavaScript)**: Node.js 22, Express (REST API), `@grpc/grpc-js` (gRPC Server), MongoDB 8 (`mongoose`)
- **Backend Service B (JavaScript)**: Node.js 22, Express, `@grpc/grpc-js` (gRPC Client `WatchRecords` stream), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **Frontend (JavaScript/TypeScript)**: Angular 20 SPA
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search Engine**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Codebase Composition (Pure JavaScript)

```
/frontend             Angular 20 app (REST client)
/backend-service-a    Node.js 22 JavaScript service — gRPC server (`RecordService`), Express REST API, MongoDB ORM
/backend-service-b    Node.js 22 JavaScript service — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto         .proto contract defining gRPC interface between JavaScript services
docker-compose.yml    Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

## Install & Run Commands

```bash
# 1. Start backend containers
docker compose up -d

# 2. Start JavaScript Service A
cd backend-service-a
npm install
npm start

# 3. Start JavaScript Service B
cd backend-service-b
npm install
npm start

# 4. Start Frontend
cd frontend
npm install
npx ng serve
```
