# CE-Platform-Stack — branch CE-CSTS-003

Testbed reference repository for validating a code-scanning platform against
a locked **C# + TypeScript** technology stack (**C# .NET 8.0 / .NET 9.0**).

This branch is part of the `CE-CS`, `CE-PYCS`, `CE-CSJS`, and `CE-CSTS` C# matrices:

| Branch | Primary Pair | C# / Language Build Tool | Package Manager | Project Structure |
|---|---|---|---|---|
| `CE-CSTS-003` | C# + TypeScript | MSBuild | pnpm | **Monolith** |

## Technology Baseline (C# + TypeScript)

All core technologies are genuinely wired and exercised on this branch:
- **C# Service A**: .NET 8.0 / .NET 9.0, ASP.NET Core Kestrel Web Server, `Grpc.AspNetCore` (gRPC Server), MongoDB ORM (`MongoDB.Driver`), Security Code Scan Roslyn Analyzers
- **Service B**: gRPC Client (`WatchRecords` stream), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **Frontend**: Angular 20 SPA
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search Engine**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Codebase Composition

```
/frontend             Angular 20 app (REST client)
/backend-cs-service-a C# .NET 8.0 / .NET 9.0 service — gRPC server (`RecordService`), Kestrel REST API, Roslyn Analyzers
/backend-service-b    Service B — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto         .proto contract defining gRPC interface
docker-compose.yml    Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

## Install & Run Commands

```bash
# 1. Start backend containers
docker compose up -d

# 2. Start C# Service A
cd backend-cs-service-a
dotnet build
dotnet run

# 3. Start Service B
cd backend-service-b
npm install
npm start

# 4. Start Frontend
cd frontend
npm install
npx ng serve
```
