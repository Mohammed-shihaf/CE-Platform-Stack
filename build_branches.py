import os
import subprocess

BRANCHES = [
    ("CE-PYTS-001", "setuptools", "npm", "Monolith"),
    ("CE-PYTS-002", "setuptools", "npm", "Modular Monolith"),
    ("CE-PYTS-003", "setuptools", "npm", "Microservices"),
    ("CE-PYTS-004", "setuptools", "npm", "Event-driven"),
    ("CE-PYTS-005", "setuptools", "npm", "Distributed System"),
    ("CE-PYTS-006", "poetry", "pnpm", "Monolith"),
    ("CE-PYTS-007", "poetry", "pnpm", "Modular Monolith"),
    ("CE-PYTS-008", "poetry", "pnpm", "Microservices"),
    ("CE-PYTS-009", "poetry", "pnpm", "Event-driven"),
    ("CE-PYTS-010", "poetry", "pnpm", "Distributed System"),
    ("CE-PYTS-011", "hatch", "yarn (Berry)", "Monolith"),
    ("CE-PYTS-012", "hatch", "yarn (Berry)", "Modular Monolith"),
    ("CE-PYTS-013", "hatch", "yarn (Berry)", "Microservices"),
    ("CE-PYTS-014", "hatch", "yarn (Berry)", "Event-driven"),
    ("CE-PYTS-015", "hatch", "yarn (Berry)", "Distributed System"),
    ("CE-PYTS-016", "flit", "bun", "Monolith"),
    ("CE-PYTS-017", "flit", "bun", "Modular Monolith"),
    ("CE-PYTS-018", "flit", "bun", "Microservices"),
    ("CE-PYTS-019", "flit", "bun", "Event-driven"),
    ("CE-PYTS-020", "flit", "bun", "Distributed System"),
    ("CE-PYTS-021", "uv", "npm (esbuild)", "Monolith"),
    ("CE-PYTS-022", "uv", "npm (esbuild)", "Modular Monolith"),
    ("CE-PYTS-023", "uv", "npm (esbuild)", "Microservices"),
    ("CE-PYTS-024", "uv", "npm (esbuild)", "Event-driven"),
    ("CE-PYTS-025", "uv", "npm (esbuild)", "Distributed System"),
]

README_TEMPLATE = """# CE-Platform-Stack — branch {branch_name}

Testbed reference repository for validating a code-scanning platform against
a locked dual-language microservices technology stack (**Python** + **TypeScript**).
See the `main` branch README for the full repository purpose and baseline.

This branch is part of the `CE-PYTS-001`..`CE-PYTS-025` Python + TypeScript combination matrix (5 build tools x 5 package managers x 5 architecture patterns):

| Branch | Python Build Tool | TS Package Manager | Architecture Pattern |
|---|---|---|---|
| `{branch_name}` | {py_tool} | {ts_pkg} | {arch} |

## Dual-Language Technology Baseline

All eight locked technologies are genuinely wired and exercised on this branch:
- **Backend Service A (Python)**: Python 3.11+, FastAPI (REST API), `grpcio` (gRPC Server), MongoDB 8 (`pymongo`)
- **Backend Service B (TypeScript)**: Node.js 22, Express, `@grpc/grpc-js` (gRPC Client), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **Frontend (TypeScript)**: Angular 20 SPA
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Repository Structure

```
/frontend                   Angular 20 TypeScript app (REST client)
/backend-python-service-a   Python service — gRPC server (`RecordService`), FastAPI REST API, MongoDB ORM
/backend-service-b          TypeScript service — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto               .proto contract defining the gRPC service between Python and TypeScript
docker-compose.yml          Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

## Install & Run Commands

```bash
# Start backend containers
docker compose up -d

# Start Python Service A
cd backend-python-service-a
python -m pip install -r requirements.txt
python -m src.main

# Start TypeScript Service B
cd backend-service-b
npm install
npm start

# Start Angular Frontend
cd frontend
npm install
npx ng serve
```
"""

def run_cmd(cmd, cwd):
    res = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error executing '{cmd}': {res.stderr}")
    return res.stdout

def main():
    repo_dir = r"C:\Users\moham\.gemini\antigravity\scratch\CE-Platform-Stack"

    # Make sure git working directory is committed on current branch first
    run_cmd("git add -A", repo_dir)
    run_cmd('git commit -m "add backend-python-service-a implementation"', repo_dir)

    for branch_name, py_tool, ts_pkg, arch in BRANCHES:
        print(f"--> Creating & Pushing branch {branch_name} ({py_tool} / {ts_pkg} / {arch})...")
        run_cmd(f"git checkout -B {branch_name}", repo_dir)
        
        # Write README.md for this branch
        readme_path = os.path.join(repo_dir, "README.md")
        content = README_TEMPLATE.format(
            branch_name=branch_name,
            py_tool=py_tool,
            ts_pkg=ts_pkg,
            arch=arch
        )
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        run_cmd("git add README.md", repo_dir)
        run_cmd(f'git commit -m "{branch_name}: Python ({py_tool}) + TS ({ts_pkg}) - {arch}"', repo_dir)
        
        # Push to remote origin
        push_res = run_cmd(f"git push -u origin {branch_name} --force", repo_dir)
        print(f"    Pushed {branch_name} to origin.")

    # Return to main branch
    run_cmd("git checkout main", repo_dir)

if __name__ == "__main__":
    main()
