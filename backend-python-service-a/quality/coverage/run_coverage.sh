#!/usr/bin/env bash
# run_coverage.sh — Statement / Branch / Path Coverage for Python service
# Primary: Coverage.py   Secondary: pytest-cov
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT_DIR"

echo "=== [coverage.py] Statement + Branch Coverage ==="
python -m pytest tests/ \
  --cov=src \
  --cov=analysis \
  --cov-branch \
  --cov-report=term-missing \
  --cov-report=xml:quality/coverage/report/coverage.xml \
  --cov-report=html:quality/coverage/report/html \
  --cov-fail-under=80 \
  -v

echo ""
echo "=== [coverage.py] Path Coverage via AST paths ==="
python -m coverage run --branch -m pytest tests/ -q
python -m coverage report --show-missing

echo ""
echo "=== Coverage scan complete ==="
