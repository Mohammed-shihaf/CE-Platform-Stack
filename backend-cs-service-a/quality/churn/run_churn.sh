#!/usr/bin/env bash
# run_churn.sh — Code Churn analysis for C# service via pydriller + git log
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"
cd "$REPO_ROOT"

mkdir -p "backend-cs-service-a/quality/churn/report"

echo "=== [pydriller] Code Churn Analysis ==="
python3 - <<'PYEOF'
from pydriller import Repository
import json, os

repo_path = "."
churn_data = []

for commit in Repository(repo_path).traverse_commits():
    for mod in commit.modified_files:
        if mod.filename.endswith(".cs"):
            churn_data.append({
                "hash": commit.hash[:8],
                "date": str(commit.committer_date),
                "author": commit.author.name,
                "file": mod.filename,
                "added": mod.added_lines,
                "deleted": mod.deleted_lines,
                "churn": mod.added_lines + mod.deleted_lines,
            })

# Sort by churn descending
churn_data.sort(key=lambda x: x["churn"], reverse=True)

total_churn = sum(r["churn"] for r in churn_data)
print(f"Total C# Code Churn: {total_churn} lines across {len(churn_data)} file-commits")
print(f"\nTop churned files:")
for r in churn_data[:10]:
    print(f"  {r['file']:40s} +{r['added']} -{r['deleted']}  ({r['hash']})")

out_path = "backend-cs-service-a/quality/churn/report/churn_report.json"
with open(out_path, "w") as f:
    json.dump(churn_data, f, indent=2, default=str)
print(f"\nFull report: {out_path}")
PYEOF

echo ""
echo "=== [git log] Churn via git log --stat ==="
git log --stat --oneline -- "backend-cs-service-a/*.cs" "backend-cs-service-a/**/*.cs" \
  2>/dev/null | tee "backend-cs-service-a/quality/churn/report/git_churn.txt" || true

echo "=== Code Churn scan complete ==="
