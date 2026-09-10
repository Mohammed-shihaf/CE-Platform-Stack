#!/usr/bin/env bash
# run_stryker.sh — Mutation Score + All Uses Coverage for C# via Stryker.NET
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT_DIR"

mkdir -p quality/stryker/report
mkdir -p quality/stryker_uses/report

echo "=== [Stryker.NET] Mutation Testing ==="
dotnet stryker \
  --config-file stryker-config.json \
  --reporter progress \
  --reporter html \
  --reporter json \
  --output quality/stryker/report \
  --break-at 60

echo "=== Stryker mutation scan complete ==="
