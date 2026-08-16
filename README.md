# CE-Platform-Stack — branch CE-046

Testbed reference repo for validating a code-scanning platform against
a locked microservices tech stack. See the `main` branch README for
the full repo purpose and technology baseline. This branch is part of
the CE-001..CE-060 full combination matrix (bundler x package manager x
architecture note, 3x4x5). This branch:

| Bundler | Package Manager | Architecture note |
|---|---|---|
| Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | yarn (Berry, `yarn set version berry`) | Monolith |

All seven locked technologies are genuinely wired and exercised:
Angular 20, Node.js 22, MongoDB 8, Elasticsearch 8, SNS (via LocalStack),
gRPC (`@grpc/grpc-js` + `@grpc/proto-loader`), SES (via LocalStack).
No application code, proto contract, or business logic changed
relative to CE-A1/CE-A5 — this branch combines CE-A5's bundler choice
(Webpack) with CE-A2's package-manager approach (Yarn Berry).

## What this branch is

- **Bundler**: same as CE-A5 — `frontend/angular.json` points
  `architect.build` / `architect.serve` / `architect.extract-i18n` at
  `@angular-devkit/build-angular`'s legacy Webpack-based builders
  instead of the esbuild `@angular/build:application` builder.
  `@angular-devkit/build-angular` is a devDependency.
- **Package manager**: same as CE-A2 — each of `frontend`,
  `backend-service-a`, and `backend-service-b` had its
  `package-lock.json` removed and was switched to Yarn Berry via
  `yarn set version berry`. Yarn pins itself per-package via
  `.yarn/releases/yarn-4.18.0.cjs` + `yarnPath` in `.yarnrc.yml` (no
  global Corepack in this environment), and each `package.json` is
  stamped `"packageManager": "yarn@4.18.0"`. `.yarnrc.yml` sets
  `nodeLinker: node-modules` (keeps the on-disk `node_modules` layout
  identical to the npm/pnpm branches — a package-manager swap only,
  not a module-resolution change) and `enableScripts: true` (Yarn
  Berry disables postinstall/build scripts by default; without this,
  the native Webpack/esbuild-adjacent dependencies wouldn't build).
  `yarn.lock` replaces `package-lock.json` in each package.
- **Architecture note**: Monolith (README/architecture-note label
  only, does not change the actual code structure — same pattern used
  by every CE-A*/CE-0* branch).

## Install & build

```bash
cd frontend && yarn install && yarn ng build
cd backend-service-a && yarn install && yarn check
cd backend-service-b && yarn install && yarn check
```

Verified in the build sandbox: `yarn install` succeeded for all three
packages, and `yarn ng build` produced a hashed Webpack production
bundle (`main.<hash>.js`, `polyfills.<hash>.js`, `runtime.<hash>.js`,
`styles.<hash>.css`) under `frontend/dist/frontend`. Both backend
packages' `yarn check` (`node -c`, a syntax check of the entry point)
passed cleanly.

## Run it / backend wiring

Unchanged from CE-A1 — see that branch's README for run commands
(`yarn start` in each backend package, `yarn ng serve` for the
frontend), the gRPC/Mongo/Elasticsearch/SNS/SES wiring,
`docker-compose.yml`, and the full end-to-end verification notes.

## What was actually verified in this build sandbox

No Docker daemon is available in this sandbox, so MongoDB 8 /
Elasticsearch 8 / LocalStack containers were not started here. What
**was** verified directly for this specific branch: `yarn install`
completes cleanly for `frontend`, `backend-service-a`, and
`backend-service-b`; `yarn ng build` produces a working Webpack
production bundle; both backend services pass a syntax/require-time
check. The full MongoDB-backed gRPC end-to-end smoke test
(`mongodb-memory-server`, a real downloaded MongoDB binary, not a
mock) was established on CE-A1 and is architecturally identical here
(no backend code differs) — it is not re-run on every one of the 60
matrix branches for sandbox time reasons, but nothing in this branch's
diff (bundler + package manager only) touches the backend runtime
path that test exercises.
