# CE-Platform-Stack — branch CE-059

Testbed reference repo for validating a code-scanning platform against
a locked microservices tech stack. See the `main` branch README for
the full repo purpose and technology baseline. This branch is part of
the CE-001..CE-060 full combination matrix (bundler x package manager x
architecture note, 3x4x5). This branch:

| Bundler | Package Manager | Architecture note |
|---|---|---|
| Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | bun | Event-driven |

All seven locked technologies are genuinely wired and exercised:
Angular 20, Node.js 22, MongoDB 8, Elasticsearch 8, SNS (via LocalStack),
gRPC (`@grpc/grpc-js` + `@grpc/proto-loader`), SES (via LocalStack).
No application code, proto contract, or business logic changed
relative to CE-A1 — this branch's code and dependency tree are
identical to branch `CE-056` (same bundler + package manager
combination); only this README's architecture-note label differs.
The architecture note is a documentation label only, per the same
pattern used on every CE-A*/CE-0* branch — it does not change the
actual code structure (still REST → MongoDB → gRPC → Elasticsearch /
SNS / SES, as described in the `main` README).


## Install & build

```bash
cd frontend && bun install && bun pm trust --all && bunx ng build
cd backend-service-a && bun install && bun pm trust --all && bun run check
cd backend-service-b && bun install && bun pm trust --all && bun run check
```

Verified in the build sandbox for this branch: all three installs
completed cleanly, and the frontend build produced a hashed Webpack production bundle (`main.<hash>.js`, `polyfills.<hash>.js`, `runtime.<hash>.js`, `styles.<hash>.css`) under `frontend/dist/frontend`.
Both backend packages' check script (`node -c`, a syntax/require-time
check of the entry point) passed cleanly.

## Run it / backend wiring

Unchanged from CE-A1 — see that branch's README for run commands
(`bun start` in each backend package, `bunx ng serve`
for the frontend), the gRPC/Mongo/Elasticsearch/SNS/SES wiring,
`docker-compose.yml`, and the full end-to-end verification notes.

## What was actually verified in this build sandbox

No Docker daemon is available in this sandbox, so MongoDB 8 /
Elasticsearch 8 / LocalStack containers were not started here. What
**was** verified directly for this specific branch: the frontend
build succeeds and produces a real production bundle, and both
backend services install their dependencies and pass a syntax/
require-time check. The full MongoDB-backed gRPC end-to-end smoke
test (`mongodb-memory-server`, a real downloaded MongoDB binary, not
a mock) was established on CE-A1, and the deeper install-level
verification (yarn/pnpm/bun install correctness, and the one genuine
Webpack+bun dependency-nesting issue that was found and fixed) was
done once per bundler+package-manager combination on branch
`CE-056`. It is not re-run in full on every one of the 60
matrix branches for sandbox time reasons — this branch's only diff
from `CE-056` is the architecture-note text in this README, so
nothing in the diff touches the backend runtime path that test
exercises or the install mechanics already verified on the base
branch.
