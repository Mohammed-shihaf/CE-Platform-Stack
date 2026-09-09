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

### Python + TypeScript Dual-Language Matrix (CE-PYTS-001..CE-PYTS-010)

`CE-PYTS-001` through `CE-PYTS-010` extend `CE-Platform-Stack` with a focused **dual-language cross-product matrix** combining **Python 3.11+** (FastAPI / gRPC Server) and **TypeScript** (Node.js 22 Express gRPC Client + Angular 20 Frontend).

It evaluates 5 Python build tool stacks (`setuptools`, `poetry`, `hatch`, `flit`, `uv`) x 5 TypeScript package manager/bundlers (`npm`, `pnpm`, `yarn Berry`, `bun`, `npm esbuild`) across the 2 core project structures (**Monolith** and **Microservices**):

| Branch | Python Build Tool | JS/TS Package Manager | Project Structure | Composition |
|---|---|---|---|---|
| CE-PYTS-001 | setuptools | npm | Monolith | Python (FastAPI/gRPC) + TS (Node/Express/Angular) single workspace |
| CE-PYTS-002 | setuptools | npm | Microservices | Decoupled Python Service A + TS Service B + Angular TS Frontend |
| CE-PYTS-003 | poetry | pnpm | Monolith | Python (Poetry) + TS (pnpm workspace) single workspace |
| CE-PYTS-004 | poetry | pnpm | Microservices | Decoupled Python Service A (Poetry) + TS Service B (pnpm) + Angular TS Frontend |
| CE-PYTS-005 | hatch | yarn (Berry) | Monolith | Python (Hatchling) + TS (Yarn Berry) single workspace |
| CE-PYTS-006 | hatch | yarn (Berry) | Microservices | Decoupled Python Service A (Hatch) + TS Service B (Yarn) + Angular TS Frontend |
| CE-PYTS-007 | flit | bun | Monolith | Python (Flit) + TS (Bun runtime/packager) single workspace |
| CE-PYTS-008 | flit | bun | Microservices | Decoupled Python Service A (Flit) + TS Service B (Bun) + Angular TS Frontend |
| CE-PYTS-009 | uv | npm (esbuild/vite) | Monolith | Python (uv runner) + TS (esbuild) single workspace |
| CE-PYTS-010 | uv | npm (esbuild/vite) | Microservices | Decoupled Python Service A (uv) + TS Service B (esbuild) + Angular TS Frontend |

### Pure JavaScript Matrix (CE-JS-001..CE-JS-010)

`CE-JS-001` through `CE-JS-010` extend `CE-Platform-Stack` with a dedicated **Pure JavaScript matrix** (Node.js 22 / Bun ES2022 JavaScript gRPC microservices + Angular frontend) evaluated across 5 top JS package managers/bundlers (`npm`, `pnpm`, `yarn Berry`, `bun`, `npm esbuild`) and 2 core project structures (**Monolith** and **Microservices**):

| Branch | JS Runtime / Stack | JS Package Manager | Project Structure | Composition |
|---|---|---|---|---|
| CE-JS-001 | Node.js 22 JavaScript | npm | Monolith | Node.js 22 JS gRPC Server & Client + Angular Frontend single workspace |
| CE-JS-002 | Node.js 22 JavaScript | npm | Microservices | Decoupled JS Service A + JS Service B + Angular Frontend |
| CE-JS-003 | Node.js 22 JavaScript | pnpm | Monolith | Node.js 22 JS (pnpm workspace) single workspace |
| CE-JS-004 | Node.js 22 JavaScript | pnpm | Microservices | Decoupled JS Service A (pnpm) + JS Service B (pnpm) |
| CE-JS-005 | Node.js 22 JavaScript | yarn (Berry) | Monolith | Node.js 22 JS (Yarn Berry workspace) single workspace |
| CE-JS-006 | Node.js 22 JavaScript | yarn (Berry) | Microservices | Decoupled JS Service A (Yarn) + JS Service B (Yarn) |
| CE-JS-007 | Bun 1.1 JavaScript | bun | Monolith | Bun JS runtime/packager single workspace |
| CE-JS-008 | Bun 1.1 JavaScript | bun | Microservices | Decoupled Bun JS Service A + Bun JS Service B |
| CE-JS-009 | Node.js 22 JavaScript | npm (esbuild/vite) | Monolith | Node.js 22 JS + esbuild bundler single workspace |
| CE-JS-010 | Node.js 22 JavaScript | npm (esbuild/vite) | Microservices | Decoupled JS Service A (esbuild) + JS Service B (esbuild) |

### Python + Pure JavaScript Dual-Language Matrix (CE-PYJS-001..CE-PYJS-010)

`CE-PYJS-001` through `CE-PYJS-010` extend `CE-Platform-Stack` with a **Python 3.11+ + Pure JavaScript (Node.js 22 ES2022 / Bun)** dual-language microservices matrix evaluated across 5 Python build tool stacks (`setuptools`, `poetry`, `hatch`, `flit`, `uv`) x 5 JS package managers (`npm`, `pnpm`, `yarn Berry`, `bun`, `npm esbuild`) and 2 core project structures (**Monolith** and **Microservices**):

| Branch | Python Build Tool | JS Package Manager | Project Structure | Composition |
|---|---|---|---|---|
| CE-PYJS-001 | setuptools | npm | Monolith | Python (FastAPI/gRPC) + Pure JS (Node/Express) single workspace |
| CE-PYJS-002 | setuptools | npm | Microservices | Decoupled Python Service A + Pure JS Service B + JS Frontend |
| CE-PYJS-003 | poetry | pnpm | Monolith | Python (Poetry) + Pure JS (pnpm workspace) single workspace |
| CE-PYJS-004 | poetry | pnpm | Microservices | Decoupled Python Service A (Poetry) + Pure JS Service B (pnpm) |
| CE-PYJS-005 | hatch | yarn (Berry) | Monolith | Python (Hatchling) + Pure JS (Yarn Berry) single workspace |
| CE-PYJS-006 | hatch | yarn (Berry) | Microservices | Decoupled Python Service A (Hatch) + Pure JS Service B (Yarn) |
| CE-PYJS-007 | flit | bun | Monolith | Python (Flit) + Pure JS (Bun runtime/packager) single workspace |
| CE-PYJS-008 | flit | bun | Microservices | Decoupled Python Service A (Flit) + Pure JS Service B (Bun) |
| CE-PYJS-009 | uv | npm (esbuild/vite) | Monolith | Python (uv runner) + Pure JS (esbuild) single workspace |
| CE-PYJS-010 | uv | npm (esbuild/vite) | Microservices | Decoupled Python Service A (uv) + Pure JS Service B (esbuild) |

`main` holds only this README. All runnable code lives on the
`CE-A*`, `CE-0*`, `CE-PYTS-*`, `CE-PYJS-*`, and `CE-JS-*` branches — check out the branch you need and read
its README for exact run commands and any caveats specific to that
combination.




