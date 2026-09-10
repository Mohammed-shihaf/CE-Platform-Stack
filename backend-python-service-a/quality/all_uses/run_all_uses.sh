#!/usr/bin/env bash
# run_all_uses.sh — All Uses Coverage (C-Use + P-Use) for Python service
# Primary: coverage.py + beniget   Secondary: pyflakes
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT_DIR"

echo "=== [beniget] Definition-Use Chain Analysis ==="
python - <<'PYEOF'
import ast, sys
from beniget import DefUseChains

files = [
    "analysis/complexity_sample.py",
    "analysis/sast_fixture.py",
    "analysis/taint_fixture.py",
    "src/routes.py",
    "src/grpc_server.py",
]

total_defs = 0
covered_defs = 0

for filepath in files:
    try:
        with open(filepath) as f:
            src = f.read()
        module = ast.parse(src)
        duc = DefUseChains()
        duc.visit(module)
        for chain in duc.chains.values():
            total_defs += 1
            if chain.users():
                covered_defs += 1
    except Exception as e:
        print(f"  [warn] {filepath}: {e}")

pct = (covered_defs / total_defs * 100) if total_defs else 0
print(f"\nAll-Defs Coverage: {covered_defs}/{total_defs} = {pct:.1f}%")
PYEOF

echo ""
echo "=== [pyflakes] Unused Definition Detection ==="
python -m pyflakes analysis/ src/ || true

echo ""
echo "=== [coverage.py] All-Uses via branch + data-flow tests ==="
python -m pytest tests/test_data_flow.py \
  --cov=analysis \
  --cov=src \
  --cov-branch \
  --cov-report=term-missing \
  --cov-report=xml:quality/all_uses/report/all_uses_coverage.xml \
  -v

echo ""
echo "=== All Uses scan complete ==="
