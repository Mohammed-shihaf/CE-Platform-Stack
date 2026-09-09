# CE-Platform-Stack

CE-Platform-Stack is a testbed reference repository used to validate a
code-scanning platform (Testable) against a specific microservices
technology stack. It is not a production product — the business domain
(a generic "record" entity) is intentionally trivial. What matters is
that every listed technology is genuinely present and functional: real
dependencies, real working code that actually runs end to end, not
stubs that merely claim to use a technology.

## Locked technology baseline

The same seven technologies are wired into every branch, unchanged:

- **Frontend**: Angular 20
- **Backend runtime**: Node.js 22
- **Database**: MongoDB 8
- **Search**: Elasticsearch 8
- **Queue**: SNS (`@aws-sdk/client-sns`, pointed at LocalStack — no real AWS credentials required to build or run)
- **Inter-service communication**: gRPC (`@grpc/grpc-js` + `@grpc/proto-loader`)
- **Email**: SES (`@aws-sdk/client-ses`, same LocalStack-mockable approach as SNS)

## Repository shape

Identical on every branch:

```
/frontend                Angular 20 app — pages/components that call the backend over HTTP/REST
/backend-service-a       Node.js 22 — gRPC server, owns MongoDB 8 (CRUD via mongoose)
/backend-service-b       Node.js 22 — gRPC client of service-a, owns Elasticsearch 8, SNS producer, SES sender
/shared/proto            .proto contract defining the gRPC service between service-a and service-b
docker-compose.yml       Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

**Flow**: the Angular frontend creates a "record" via service-a's REST
endpoint → service-a writes it to MongoDB and pushes it down a gRPC
server-streaming call (`WatchRecords`) that service-b is subscribed to
→ service-b indexes the record into Elasticsearch, publishes an SNS
`record.created` event, and sends an SES notification email. gRPC also
exposes a unary `GetRecord` call, used by service-b for point lookups.

## Branches

Every branch below ships the exact same code and functionality. They
differ **only** in bundler, package manager, and a target-architecture
note in that branch's own README.

### Original six-branch set (CE-A1..CE-A6)

| Branch | Bundler | Package Manager | Architecture note |
|---|---|---|---|
| CE-A1 | esbuild (Angular's default Application Builder, `@angular/build`) | npm | Microservices |
| CE-A2 | esbuild | yarn (Berry, `yarn set version berry`) | Microservices |
| CE-A3 | esbuild | pnpm | Event-driven |
| CE-A4 | Vite (not a real standalone Angular CLI builder — esbuild used instead; see that branch's README) | bun | Microservices |
| CE-A5 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | npm | Microservices |
| CE-A6 | Webpack | pnpm | Distributed System |

### Full combination matrix (CE-001..CE-060)

`CE-A1`..`CE-A6` above were the original validation set. `CE-001`
through `CE-060` extend the same repo to the **full cross-product** of
bundler (esbuild / Vite / Webpack) x package manager (npm / yarn
Berry / pnpm / bun) x architecture-note label (Monolith / Modular
Monolith / Microservices / Event-driven / Distributed System) — 3 x 4
x 5 = 60 branches. All seven locked technologies are unchanged, all
60 branches. "Vite" is not a real independently-selectable Angular 20
CLI bundler (Angular's esbuild Application Builder uses Vite
internally only for its dev-server, not for `ng build`); every
Vite-labeled branch below uses esbuild instead and documents that
substitution honestly in its own README, exactly as `CE-A4` already
did for the original six-branch set. Two combinations required a
genuinely new dependency install that didn't exist in the original
six branches — Webpack+yarn (`CE-046`) and Webpack+bun (`CE-056`) —
both branches' READMEs document install/build verification in detail,
including one real dependency-nesting issue hit and fixed on the
Webpack+bun combination. Every other branch in the matrix reuses the
already-verified code+dependency tree of its bundler+package-manager
sibling and only changes its own README's architecture-note label.

| Branch | Bundler | Package Manager | Architecture note |
|---|---|---|---|
| CE-001 | esbuild (Angular's default Application Builder, `@angular/build`) | npm | Monolith |
| CE-002 | esbuild (Angular's default Application Builder, `@angular/build`) | npm | Modular Monolith |
| CE-003 | esbuild (Angular's default Application Builder, `@angular/build`) | npm | Microservices |
| CE-004 | esbuild (Angular's default Application Builder, `@angular/build`) | npm | Event-driven |
| CE-005 | esbuild (Angular's default Application Builder, `@angular/build`) | npm | Distributed System |
| CE-006 | esbuild (Angular's default Application Builder, `@angular/build`) | yarn (Berry) | Monolith |
| CE-007 | esbuild (Angular's default Application Builder, `@angular/build`) | yarn (Berry) | Modular Monolith |
| CE-008 | esbuild (Angular's default Application Builder, `@angular/build`) | yarn (Berry) | Microservices |
| CE-009 | esbuild (Angular's default Application Builder, `@angular/build`) | yarn (Berry) | Event-driven |
| CE-010 | esbuild (Angular's default Application Builder, `@angular/build`) | yarn (Berry) | Distributed System |
| CE-011 | esbuild (Angular's default Application Builder, `@angular/build`) | pnpm | Monolith |
| CE-012 | esbuild (Angular's default Application Builder, `@angular/build`) | pnpm | Modular Monolith |
| CE-013 | esbuild (Angular's default Application Builder, `@angular/build`) | pnpm | Microservices |
| CE-014 | esbuild (Angular's default Application Builder, `@angular/build`) | pnpm | Event-driven |
| CE-015 | esbuild (Angular's default Application Builder, `@angular/build`) | pnpm | Distributed System |
| CE-016 | esbuild (Angular's default Application Builder, `@angular/build`) | bun | Monolith |
| CE-017 | esbuild (Angular's default Application Builder, `@angular/build`) | bun | Modular Monolith |
| CE-018 | esbuild (Angular's default Application Builder, `@angular/build`) | bun | Microservices |
| CE-019 | esbuild (Angular's default Application Builder, `@angular/build`) | bun | Event-driven |
| CE-020 | esbuild (Angular's default Application Builder, `@angular/build`) | bun | Distributed System |
| CE-021 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | npm | Monolith |
| CE-022 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | npm | Modular Monolith |
| CE-023 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | npm | Microservices |
| CE-024 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | npm | Event-driven |
| CE-025 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | npm | Distributed System |
| CE-026 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | yarn (Berry) | Monolith |
| CE-027 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | yarn (Berry) | Modular Monolith |
| CE-028 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | yarn (Berry) | Microservices |
| CE-029 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | yarn (Berry) | Event-driven |
| CE-030 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | yarn (Berry) | Distributed System |
| CE-031 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | pnpm | Monolith |
| CE-032 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | pnpm | Modular Monolith |
| CE-033 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | pnpm | Microservices |
| CE-034 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | pnpm | Event-driven |
| CE-035 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | pnpm | Distributed System |
| CE-036 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | bun | Monolith |
| CE-037 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | bun | Modular Monolith |
| CE-038 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | bun | Microservices |
| CE-039 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | bun | Event-driven |
| CE-040 | Vite (esbuild used instead — not a real standalone Angular 20 bundler; see branch README) | bun | Distributed System |
| CE-041 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | npm | Monolith |
| CE-042 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | npm | Modular Monolith |
| CE-043 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | npm | Microservices |
| CE-044 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | npm | Event-driven |
| CE-045 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | npm | Distributed System |
| CE-046 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | yarn (Berry) | Monolith |
| CE-047 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | yarn (Berry) | Modular Monolith |
| CE-048 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | yarn (Berry) | Microservices |
| CE-049 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | yarn (Berry) | Event-driven |
| CE-050 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | yarn (Berry) | Distributed System |
| CE-051 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | pnpm | Monolith |
| CE-052 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | pnpm | Modular Monolith |
| CE-053 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | pnpm | Microservices |
| CE-054 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | pnpm | Event-driven |
| CE-055 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | pnpm | Distributed System |
| CE-056 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | bun | Monolith |
| CE-057 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | bun | Modular Monolith |
| CE-058 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | bun | Microservices |
| CE-059 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | bun | Event-driven |
| CE-060 | Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | bun | Distributed System |

### Python + TypeScript Dual-Language Matrix (CE-PYTS-001..CE-PYTS-025)

`CE-PYTS-001` through `CE-PYTS-025` extend `CE-Platform-Stack` with a **dual-language cross-product matrix** combining **Python** (FastAPI / gRPC Server) and **TypeScript** (Node.js 22 Express gRPC Client + Angular 20 Frontend).

It evaluates 5 Python build tool stacks (`setuptools`, `poetry`, `hatch`, `flit`, `uv`) x 5 TypeScript package manager/bundlers (`npm`, `pnpm`, `yarn Berry`, `bun`, `npm esbuild`) x 5 target architecture patterns (`Monolith`, `Modular Monolith`, `Microservices`, `Event-driven`, `Distributed System`).

| Branch | Python Build Tool | TS Package Manager | Architecture Pattern |
|---|---|---|---|
| CE-PYTS-001 | setuptools | npm | Monolith |
| CE-PYTS-002 | setuptools | npm | Modular Monolith |
| CE-PYTS-003 | setuptools | npm | Microservices |
| CE-PYTS-004 | setuptools | npm | Event-driven |
| CE-PYTS-005 | setuptools | npm | Distributed System |
| CE-PYTS-006 | poetry | pnpm | Monolith |
| CE-PYTS-007 | poetry | pnpm | Modular Monolith |
| CE-PYTS-008 | poetry | pnpm | Microservices |
| CE-PYTS-009 | poetry | pnpm | Event-driven |
| CE-PYTS-010 | poetry | pnpm | Distributed System |
| CE-PYTS-011 | hatch | yarn (Berry) | Monolith |
| CE-PYTS-012 | hatch | yarn (Berry) | Modular Monolith |
| CE-PYTS-013 | hatch | yarn (Berry) | Microservices |
| CE-PYTS-014 | hatch | yarn (Berry) | Event-driven |
| CE-PYTS-015 | hatch | yarn (Berry) | Distributed System |
| CE-PYTS-016 | flit | bun | Monolith |
| CE-PYTS-017 | flit | bun | Modular Monolith |
| CE-PYTS-018 | flit | bun | Microservices |
| CE-PYTS-019 | flit | bun | Event-driven |
| CE-PYTS-020 | flit | bun | Distributed System |
| CE-PYTS-021 | uv | npm (esbuild) | Monolith |
| CE-PYTS-022 | uv | npm (esbuild) | Modular Monolith |
| CE-PYTS-023 | uv | npm (esbuild) | Microservices |
| CE-PYTS-024 | uv | npm (esbuild) | Event-driven |
| CE-PYTS-025 | uv | npm (esbuild) | Distributed System |

`main` holds only this README. All runnable code lives on the
`CE-A*`, `CE-0*`, and `CE-PYTS-*` branches — check out the branch you need and read
its README for exact run commands and any caveats specific to that
combination.

