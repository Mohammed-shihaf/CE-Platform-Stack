#!/usr/bin/env bash
# run_altcover.sh — Path Coverage for C# service via AltCover
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TESTS_DIR="$(cd "$ROOT_DIR/../backend-cs-service-a.Tests" && pwd)"
cd "$TESTS_DIR"

mkdir -p "$ROOT_DIR/quality/altcover/report"

echo "=== [AltCover] Path Coverage Instrumentation ==="
dotnet test \
  /p:AltCover=true \
  /p:AltCoverXmlReport="$ROOT_DIR/quality/altcover/report/altcover.xml" \
  /p:AltCoverAssemblyFilter="Tests$" \
  /p:AltCoverFileFilter=".*\.pb\.cs$" \
  /p:AltCoverBranchCover=true \
  /p:AltCoverStaticCover=true \
  /p:AltCoverShowStatic="[None]" \
  -v minimal

echo ""
echo "=== [AltCover] Summary ==="
cat "$ROOT_DIR/quality/altcover/report/altcover.xml" | \
  grep -oP 'sequenceCoverage="\K[^"]+' | head -1 | \
  awk '{print "Path Coverage: " $1 "%"}' || echo "See altcover.xml for details"

echo "=== AltCover scan complete ==="
