# CE-Platform-Stack — branch CE-A6

Testbed reference repo for validating a code-scanning platform against
a locked microservices tech stack. See the `main` branch README for
the full repo purpose and the six-branch matrix. This branch:

| Bundler | Package Manager | Architecture note |
|---|---|---|
| Webpack (`@angular-devkit/build-angular:browser`, the legacy builder) | pnpm | Distributed System |

Branched from CE-A5 (Webpack + npm). Only the package manager changed:
`package-lock.json` was removed from `frontend`, `backend-service-a`,
and `backend-service-b`, and each was reinstalled with `pnpm install`,
producing `pnpm-lock.yaml` lockfiles. Because pnpm sandboxes
dependency postinstall scripts by default, each `package.json` also
gained a `pnpm.onlyBuiltDependencies` allowlist (`esbuild`,
`@parcel/watcher`, `lmdb`, `msgpackr-extract` for the frontend;
`mongodb-memory-server`, `protobufjs` for the backends) so those
scripts still run — without it, esbuild's native binary (used
internally even by the Webpack builder pipeline) would not be built
and the toolchain would fail. No application code, proto contract, or
builder configuration changed relative to CE-A5. The "architecture
note" (Distributed System vs. CE-A5's Microservices) is documentation
only and does not correspond to any code difference.

## Install & build

```bash
cd frontend && pnpm install && pnpm exec ng build
cd backend-service-a && pnpm install && pnpm run check
cd backend-service-b && pnpm install && pnpm run check
```

Verified in the build sandbox: `pnpm install` succeeds for all three
packages (build scripts approved via `pnpm.onlyBuiltDependencies`),
and `pnpm exec ng build` produces the same hashed Webpack bundle
(`main.<hash>.js`, `polyfills.<hash>.js`, `runtime.<hash>.js`,
`styles.<hash>.css`) under `frontend/dist/frontend`.

## Run it / backend wiring

Unchanged from CE-A1 — see that branch's README for run commands
(`pnpm start` in each backend package, `pnpm exec ng serve` for the
frontend), the gRPC/Mongo/Elasticsearch/SNS/SES wiring,
`docker-compose.yml`, and the honest note about what was verified
against real infrastructure in the build sandbox (no Docker daemon was
available there).
