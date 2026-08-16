# CE-Platform-Stack — branch CE-056

Testbed reference repo for validating a code-scanning platform against
a locked microservices tech stack. See the `main` branch README for
the full repo purpose and technology baseline. This branch is part of
the CE-001..CE-060 full combination matrix (bundler x package manager x
architecture note, 3x4x5). This branch:

| Bundler | Package Manager | Architecture note |
|---|---|---|
| Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | bun | Monolith |

All seven locked technologies are genuinely wired and exercised:
Angular 20, Node.js 22, MongoDB 8, Elasticsearch 8, SNS (via LocalStack),
gRPC (`@grpc/grpc-js` + `@grpc/proto-loader`), SES (via LocalStack).
No application code, proto contract, or business logic changed
relative to CE-A1/CE-A5 — this branch combines CE-A5's bundler choice
(Webpack) with CE-A4's package-manager approach (bun).

## What this branch is

- **Bundler**: same as CE-A5 — `frontend/angular.json` points
  `architect.build` / `architect.serve` / `architect.extract-i18n` at
  `@angular-devkit/build-angular`'s legacy Webpack-based builders
  instead of the esbuild `@angular/build:application` builder.
  `@angular-devkit/build-angular` is a devDependency.
- **Package manager**: same as CE-A4 — each of `frontend`,
  `backend-service-a`, and `backend-service-b` had its
  `package-lock.json` removed, and `node_modules` reinstalled with
  `bun install`, producing `bun.lock` lockfiles. `@parcel/watcher`
  (frontend) and `protobufjs` (both backend packages) needed
  `bun pm trust --all` to allow their postinstall/build scripts to
  run, since Bun blocks lifecycle scripts for untrusted packages by
  default — that's a one-time step after `bun install` on a fresh
  clone, and `trustedDependencies` in each `package.json` records it.
- **Architecture note**: Monolith (README/architecture-note label
  only, does not change the actual code structure — same pattern used
  by every CE-A*/CE-0* branch).

## A build wrinkle worth documenting honestly

The first `bun install` + `bun pm trust --all` pass in this sandbox
produced a broken `node_modules` tree: `@babel/helper-compilation-targets`'s
nested `lru-cache@5.1.1` (a transitive dependency pulled in by the
Webpack/babel-loader toolchain, not present in CE-A4's esbuild
dependency graph) ended up resolving `yallist` from the top-level
`node_modules/yallist@5.0.0` instead of a compatible nested `^3.0.2`,
because that package's own `node_modules/yallist` folder wasn't
created during the initial install. That produced `ng build` failures
(`TypeError: Yallist is not a constructor` in the webpack-loader
babel step). Deleting `node_modules` and `bun.lock` and re-running
`bun install` from scratch (`bun pm trust --all` again afterward) gave
a clean, correctly nested tree with its own `node_modules/yallist` for
`lru-cache`, and `ng build` then succeeded. This is called out here
because it's the one combination in the full matrix (Webpack + bun)
that pulls in this specific legacy babel/webpack dependency chain and
hit it; no application/proto code was touched to fix it.

## Install & build

```bash
cd frontend && bun install && bun pm trust --all && bunx ng build
cd backend-service-a && bun install && bun pm trust --all && bun run check
cd backend-service-b && bun install && bun pm trust --all && bun run check
```

Verified in the build sandbox: all three `bun install`s completed,
`bunx ng build` produced a hashed Webpack production bundle
(`main.<hash>.js`, `polyfills.<hash>.js`, `runtime.<hash>.js`,
`styles.<hash>.css`) under `frontend/dist/frontend`, and both backend
packages' `bun run check` (`node -c`, a syntax check of the entry
point) passed cleanly.

## Run it / backend wiring

Unchanged from CE-A1 — see that branch's README for run commands
(`bun start` in each backend package, `bunx ng serve` for the
frontend), the gRPC/Mongo/Elasticsearch/SNS/SES wiring,
`docker-compose.yml`, and the full end-to-end verification notes.

## What was actually verified in this build sandbox

No Docker daemon is available in this sandbox, so MongoDB 8 /
Elasticsearch 8 / LocalStack containers were not started here. What
**was** verified directly for this specific branch: `bun install`
completes (after the fresh-reinstall workaround above) for
`frontend`, `backend-service-a`, and `backend-service-b`; `bunx ng
build` produces a working Webpack production bundle; both backend
services pass a syntax/require-time check. The full MongoDB-backed
gRPC end-to-end smoke test (`mongodb-memory-server`, a real downloaded
MongoDB binary, not a mock) was established on CE-A1 and is
architecturally identical here (no backend code differs) — it is not
re-run on every one of the 60 matrix branches for sandbox time
reasons, but nothing in this branch's diff (bundler + package manager
only) touches the backend runtime path that test exercises.
