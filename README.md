# CE-Platform-Stack — branch CE-PYTS-004

Testbed reference repository for validating a code-scanning platform against
a locked dual-language microservices technology stack (**Python** + **TypeScript/JavaScript**).

This branch is part of the `CE-PYTS-001`..`CE-PYTS-010` dual-language combination matrix (5 Python build tools x 5 JS/TS package managers x 2 project structures):

| Branch | Python Build Tool | JS/TS Package Manager | Project Structure |
|---|---|---|---|
| `CE-PYTS-004` | poetry | pnpm | **Microservices** |

## Dual-Language Technology Baseline

All core technologies are genuinely wired and exercised on this branch:
- **Python Service A**: Python 3.11+, FastAPI (REST API), `grpcio` (gRPC Server), MongoDB 8 (`pymongo`)
- **TypeScript Service B**: TypeScript / Node.js 22, Express, `@grpc/grpc-js` (gRPC Client), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **TypeScript Frontend**: Angular 20 SPA (TypeScript)
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search Engine**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Codebase Composition (Python + TypeScript)

```
/frontend                   Angular 20 TypeScript app (REST client)
/backend-python-service-a   Python 3.11+ service — gRPC server (`RecordService`), FastAPI REST API, MongoDB ORM
/backend-service-b          TypeScript / Node.js 22 service — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto               .proto contract defining gRPC interface between Python and TypeScript
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

# 3. Start TypeScript Service B
cd backend-service-b
npm install
npm start

# 4. Start Angular TypeScript Frontend
cd frontend
npm install
npx ng serve
```
