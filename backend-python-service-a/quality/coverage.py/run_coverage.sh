#!/usr/bin/env bash
# run_coverage.sh — Statement + Branch Coverage for Python
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

mkdir -p report

echo "=== [coverage.py] Running test suite with coverage ==="
if command -v coverage &>/dev/null; then
    coverage run --branch -m pytest test_sample_covered.py -v
    coverage report -m
    coverage xml -o report/coverage.xml
    coverage html -d report/html
elif python3 -m coverage --version &>/dev/null; then
    python3 -m coverage run --branch -m pytest test_sample_covered.py -v
    python3 -m coverage report -m
    python3 -m coverage xml -o report/coverage.xml
    python3 -m coverage html -d report/html
else
    python -m pytest test_sample_covered.py --cov=. --cov-branch --cov-report=xml:report/coverage.xml --cov-report=term-missing
fi

echo "=== [coverage.py] Scan complete ==="
