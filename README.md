# CE-Platform-Stack — branch CE-A3

Testbed reference repo for validating a code-scanning platform against
a locked microservices tech stack. See the `main` branch README for
the full repo purpose and the six-branch matrix. This branch:

| Bundler | Package Manager | Architecture note |
|---|---|---|
| esbuild | pnpm | Event-driven |

Branched from CE-A1. Only the package manager changed: `package-lock.json`
was removed from `frontend`, `backend-service-a`, and
`backend-service-b`, and each was reinstalled with `pnpm install`,
producing `pnpm-lock.yaml` lockfiles. Each `package.json` also gained a
`pnpm.onlyBuiltDependencies` allowlist so pnpm's default script
sandboxing doesn't block esbuild's native binary build (frontend) or
the `mongodb-memory-server` / `protobufjs` postinstall steps (backend
packages). The Angular builder is unchanged from CE-A1
(`@angular/build:application`, esbuild). No application code or proto
contract changed. The "Event-driven" architecture note is
documentation only — the actual code flow (REST → Mongo → gRPC →
Elasticsearch/SNS/SES) is identical to every other branch; it is
arguably "event-driven" in the sense that service-b reacts to a gRPC
stream event and further reacts by publishing an SNS event, but no
code was altered to make this label more or less true than on any
other branch.

## Install & build

```bash
cd frontend && pnpm install && pnpm exec ng build
cd backend-service-a && pnpm install && pnpm run check
cd backend-service-b && pnpm install && pnpm run check
```

Verified in the build sandbox: `pnpm install` succeeds for all three
packages, and `pnpm exec ng build` produces a production esbuild
bundle under `frontend/dist/frontend`.

## Run it / backend wiring

Unchanged from CE-A1 — see that branch's README for run commands
(`pnpm start` in each backend package, `pnpm exec ng serve` for the
frontend), the gRPC/Mongo/Elasticsearch/SNS/SES wiring,
`docker-compose.yml`, and the honest note about what was verified
against real infrastructure in the build sandbox (no Docker daemon was
available there; the REST → MongoDB → gRPC path was verified fully
end-to-end against a real MongoDB binary).
