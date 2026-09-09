# CE-Platform-Stack — branch CE-PYTS-004

Testbed reference repository for validating a code-scanning platform against
a locked dual-language microservices technology stack (**Python** + **TypeScript**).
See the `main` branch README for the full repository purpose and baseline.

This branch is part of the `CE-PYTS-001`..`CE-PYTS-025` Python + TypeScript combination matrix (5 build tools x 5 package managers x 5 architecture patterns):

| Branch | Python Build Tool | TS Package Manager | Architecture Pattern |
|---|---|---|---|
| `CE-PYTS-004` | setuptools | npm | Event-driven |

## Dual-Language Technology Baseline

All eight locked technologies are genuinely wired and exercised on this branch:
- **Backend Service A (Python)**: Python 3.11+, FastAPI (REST API), `grpcio` (gRPC Server), MongoDB 8 (`pymongo`)
- **Backend Service B (TypeScript)**: Node.js 22, Express, `@grpc/grpc-js` (gRPC Client), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **Frontend (TypeScript)**: Angular 20 SPA
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Repository Structure

```
/frontend                   Angular 20 TypeScript app (REST client)
/backend-python-service-a   Python service — gRPC server (`RecordService`), FastAPI REST API, MongoDB ORM
/backend-service-b          TypeScript service — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto               .proto contract defining the gRPC service between Python and TypeScript
docker-compose.yml          Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

## Install & Run Commands

```bash
# Start backend containers
docker compose up -d

# Start Python Service A
cd backend-python-service-a
python -m pip install -r requirements.txt
python -m src.main

# Start TypeScript Service B
cd backend-service-b
npm install
npm start

# Start Angular Frontend
cd frontend
npm install
npx ng serve
```
