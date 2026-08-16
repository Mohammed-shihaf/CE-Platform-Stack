# CE-Platform-Stack — branch CE-A4

Testbed reference repo for validating a code-scanning platform against
a locked microservices tech stack. See the `main` branch README for
the full repo purpose and the six-branch matrix. This branch:

| Bundler | Package Manager | Architecture note |
|---|---|---|
| esbuild (see "About the 'Vite' requirement" below) | bun | Microservices |

## About the "Vite" requirement

The spec for this branch called for Vite as the bundler. That is not
achievable honestly: the Angular CLI (v20, same as every other branch
in this repo) does not expose Vite as a separate, independently
selectable production **bundler**. What Angular 20 actually has is:

- `@angular/build:application` (the esbuild Application Builder, used
  by CE-A1/A2/A3) — bundles with **esbuild** for both `ng build` and
  `ng serve`.
- Angular's dev server (`@angular/build:dev-server`, used by the
  Application Builder) uses **Vite internally purely as a dev-time
  file server / HMR layer** on top of esbuild-produced output when you
  run `ng serve`. This is not user-selectable, isn't used for
  production builds, and there is no `architect.build.builder` value
  in `angular.json` that hands bundling itself to Vite. You cannot
  point `ng build` at a "Vite builder" the way CE-A1 points it at
  esbuild or CE-A5 points it at Webpack.
- The legacy `@angular-devkit/build-angular:browser` builder (used by
  CE-A5/A6) bundles with **Webpack**, not Vite, either.

So, per the task's own fallback instruction, this branch uses esbuild
(`@angular/build:application`, identical to CE-A1) as the bundler and
says so honestly here rather than claiming a "Vite build" that isn't a
real, distinct option in Angular 20's CLI. If a future Angular release
adds first-class Vite-as-bundler support, this branch's `angular.json`
would be the file to update.

## What actually changed vs. CE-A1

Only the package manager: `frontend`, `backend-service-a`, and
`backend-service-b` each had `package-lock.json` removed and
`node_modules` reinstalled with `bun install`, producing `bun.lock`
lockfiles. A couple of native dependency postinstall scripts
(`@parcel/watcher` in `frontend`, `protobufjs` in both backend
packages) needed `bun pm trust --all` to run, since Bun blocks
lifecycle scripts for untrusted packages by default — that's a one-
time step after `bun install` on a fresh clone. No application code,
proto contract, or `angular.json` builder configuration changed
relative to CE-A1.

## Install & build

```bash
cd frontend && bun install && bun pm trust --all && bunx ng build
cd backend-service-a && bun install && bun pm trust --all
cd backend-service-b && bun install && bun pm trust --all
```

Verified in the build sandbox: `bun install` succeeds for all three
packages, `bunx ng build` produces a production esbuild bundle under
`frontend/dist/frontend`, and the full REST → MongoDB → gRPC
(unary + server-streaming) smoke test used for CE-A1 was re-run
against this branch's bun-installed `node_modules` (services still run
under Node.js — the locked backend runtime — via `node src/server.js`
/ `node src/index.js`; Bun was used only as the package manager here)
and passed.

## Run it / backend wiring

Unchanged from CE-A1 — see that branch's README for run commands, the
gRPC/Mongo/Elasticsearch/SNS/SES wiring, `docker-compose.yml`, and the
honest note about what was verified against real infrastructure in the
build sandbox (no Docker daemon was available there).
