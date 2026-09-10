#!/usr/bin/env bash
# run_jscpd.sh — Code Duplication detection for Python service
# Tool: jscpd (primary) + copydetect (secondary)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=== [jscpd] Code Duplication Scan — Python ==="
npx jscpd \
  --path "$ROOT_DIR/src" \
  --path "$ROOT_DIR/analysis" \
  --languages python \
  --min-lines 5 \
  --min-tokens 50 \
  --threshold 5 \
  --reporters console,json \
  --output "$ROOT_DIR/quality/jscpd/report"

echo "=== [copydetect] Secondary Duplication Scan ==="
python -m copydetect \
  --dir "$ROOT_DIR/src" \
  --dir "$ROOT_DIR/analysis" \
  --extensions py \
  --noise-threshold 25 \
  --guarantee-threshold 50

echo "=== jscpd scan complete ==="
