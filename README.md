# CE-Platform-Stack — branch CE-PYJS-009

Testbed reference repository for validating a code-scanning platform against
a locked dual-language microservices technology stack (**Python** + **JavaScript**).

This branch is part of the `CE-PYJS-001`..`CE-PYJS-010` dual-language combination matrix (5 Python build tools x 5 JS package managers x 2 project structures):

| Branch | Python Build Tool | JS Package Manager | Project Structure |
|---|---|---|---|
| `CE-PYJS-009` | uv | npm (esbuild/vite) | **Monolith** |

## Dual-Language Technology Baseline (Python + Pure JavaScript)

All core technologies are genuinely wired and exercised on this branch:
- **Python Service A**: Python 3.11+, FastAPI (REST API), `grpcio` (gRPC Server), MongoDB 8 (`pymongo`)
- **JavaScript Service B**: Node.js 22 Pure JavaScript, Express, `@grpc/grpc-js` (gRPC Client `WatchRecords` subscriber), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **JavaScript Frontend**: Angular 20 SPA
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search Engine**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Codebase Composition (Python + JavaScript)

```
/frontend                   Angular 20 app (REST client)
/backend-python-service-a   Python 3.11+ service — gRPC server (`RecordService`), FastAPI REST API, MongoDB ORM
/backend-service-b          Pure JavaScript / Node.js 22 service — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto               .proto contract defining gRPC interface between Python and JavaScript
docker-compose.yml          Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

## Install & Run Commands

```bash
# 1. Start backend containers
docker compose up -d

# 2. Start Python Service A
cd backend-python-service-a
python -m pip install -r requirements.txt
python -m src.main

# 3. Start JavaScript Service B
cd backend-service-b
npm install
npm start

# 4. Start Frontend
cd frontend
npm install
npx ng serve
```
