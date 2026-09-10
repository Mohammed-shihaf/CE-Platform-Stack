#!/usr/bin/env bash
# run_sca.sh — Software Composition Analysis for C# service (NuGet + CVE)
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT_DIR"

mkdir -p quality/sca/report

echo "=== [NuGet Audit] Vulnerable Dependency Detection ==="
# Note: Newtonsoft.Json 12.0.1 contains CVE-2024-21907 (ReDoS)
dotnet list package --vulnerable --include-transitive \
  2>&1 | tee quality/sca/report/nuget_audit.txt

echo ""
echo "=== [NuGet Audit] Outdated Packages ==="
dotnet list package --outdated \
  2>&1 | tee quality/sca/report/nuget_outdated.txt

echo ""
echo "=== [NuGet Audit] All Transitive Dependencies ==="
dotnet list package --include-transitive \
  2>&1 | tee quality/sca/report/nuget_transitive.txt

echo "=== SCA scan complete ==="
