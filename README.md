# CE-Platform-Stack — branch CE-A2

Testbed reference repo for validating a code-scanning platform against
a locked microservices tech stack. See the `main` branch README for
the full repo purpose and the six-branch matrix. This branch:

| Bundler | Package Manager | Architecture note |
|---|---|---|
| esbuild | yarn (Berry, `yarn set version berry`) | Microservices |

Branched from CE-A1. Only the package manager changed: each of
`frontend`, `backend-service-a`, and `backend-service-b` had its
`package-lock.json` removed and was switched to Yarn Berry via
`yarn set version berry` (this repo has no global Corepack, so Yarn
pins itself per-package via `.yarn/releases/yarn-4.18.0.cjs` +
`yarnPath` in `.yarnrc.yml`, and stamps `"packageManager": "yarn@4.18.0"`
into each `package.json` — the same effect Corepack's shim would give).
`.yarnrc.yml` also sets `nodeLinker: node-modules` (so the on-disk
`node_modules` layout — and the rest of the codebase — stays identical
to the npm/pnpm branches, this is a package-manager swap only, not a
module-resolution-strategy change) and `enableScripts: true` (Yarn
Berry disables dependency postinstall/build scripts by default; without
this, esbuild's native binary and a couple of other native
dependencies wouldn't get built). `yarn.lock` replaces
`package-lock.json` in each package. The Angular builder is unchanged
from CE-A1 (`@angular/build:application`, esbuild). No application
code or proto contract changed.

## Install & build

```bash
cd frontend && yarn install && yarn ng build
cd backend-service-a && yarn install && yarn check
cd backend-service-b && yarn install && yarn check
```

Verified in the build sandbox: `yarn install` succeeds for all three
packages, `yarn ng build` produces a production esbuild bundle under
`frontend/dist/frontend`, and the full REST → MongoDB → gRPC
(unary + server-streaming) smoke test used for CE-A1 was re-run
against this branch's yarn-installed `node_modules` and passed.

## Run it / backend wiring

Unchanged from CE-A1 — see that branch's README for run commands
(`yarn start` in each backend package, `yarn ng serve` for the
frontend), the gRPC/Mongo/Elasticsearch/SNS/SES wiring,
`docker-compose.yml`, and the honest note about what was verified
against real infrastructure in the build sandbox (no Docker daemon was
available there).
