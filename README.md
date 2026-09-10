# CE-Platform-Stack — branch CE-PYCS-001

Testbed reference repository for validating a code-scanning platform against
a locked **Python + C#** technology stack (**Python 3.11+** & **C# .NET 8.0**).

This branch is part of the `CE-CS` and `CE-PYCS` dual-language matrices:

| Branch | Primary Pair | Python / C# Build Tool | Package Manager | Project Structure |
|---|---|---|---|---|
| `CE-PYCS-001` | Python + C# | setuptools / dotnet CLI | Pip / NuGet | **Monolith** |

## Technology Baseline (Python + C#)

All core technologies are genuinely wired and exercised on this branch:
- **Python Service A**: Python 3.11+, FastAPI (REST API), `grpcio` (gRPC Server), MongoDB ORM (`pymongo`), full quality suites (pytest-cov, mutmut, bandit, all-uses, jscpd, pip-audit)
- **C# Service A**: .NET 8.0, ASP.NET Core Kestrel Web Server, `Grpc.AspNetCore` (gRPC Server), MongoDB ORM (`MongoDB.Driver`), Roslyn Analyzers, SecurityCodeScan
- **C# Test Project**: xUnit, Coverlet, AltCover, Stryker.NET
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Codebase Composition

```
CE-Platform-Stack.sln        Root .NET Solution file (links C# service + tests)
/backend-python-service-a    Python 3.11+ service (FastAPI, gRPC, pymongo, quality tools)
/backend-cs-service-a        C# .NET 8.0 service — gRPC server (`RecordService`), Kestrel REST API, Roslyn Analyzers
/backend-cs-service-a.Tests  xUnit test project with Coverlet, AltCover, Stryker
/shared/proto                .proto contract defining gRPC interface
/scripts                     Repository build and evaluation scripts
```

## Install & Run Commands

```bash
# 1. Start Python Service A
cd backend-python-service-a
python -m pip install -r requirements.txt
python -m src.main

# 2. Start C# Service A
cd backend-cs-service-a
dotnet build
dotnet run

# 3. Run C# Tests & Quality Scans
cd backend-cs-service-a.Tests
dotnet test
```
