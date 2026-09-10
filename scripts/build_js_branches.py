import os
import subprocess

BRANCHES = [
    ("CE-JS-001", "JavaScript (Node 22)", "npm", "Monolith"),
    ("CE-JS-002", "JavaScript (Node 22)", "npm", "Microservices"),
    ("CE-JS-003", "JavaScript (Node 22)", "pnpm", "Monolith"),
    ("CE-JS-004", "JavaScript (Node 22)", "pnpm", "Microservices"),
    ("CE-JS-005", "JavaScript (Node 22)", "yarn (Berry)", "Monolith"),
    ("CE-JS-006", "JavaScript (Node 22)", "yarn (Berry)", "Microservices"),
    ("CE-JS-007", "JavaScript (Bun 1.1)", "bun", "Monolith"),
    ("CE-JS-008", "JavaScript (Bun 1.1)", "bun", "Microservices"),
    ("CE-JS-009", "JavaScript (Node 22)", "npm (esbuild/vite)", "Monolith"),
    ("CE-JS-010", "JavaScript (Node 22)", "npm (esbuild/vite)", "Microservices"),
]

README_TEMPLATE = """# CE-Platform-Stack — branch {branch_name}

Testbed reference repository for validating a code-scanning platform against
a locked **Pure JavaScript** microservices technology stack.

This branch is part of the `CE-JS-001`..`CE-JS-010` dedicated JavaScript combination matrix (5 JS package managers/bundlers x 2 project structures):

| Branch | Runtime / Language | JS Package Manager | Project Structure |
|---|---|---|---|
| `{branch_name}` | {runtime} | {ts_pkg} | **{arch}** |

## Pure JavaScript Technology Baseline

All core technologies are genuinely wired and exercised on this branch:
- **Backend Service A (JavaScript)**: Node.js 22, Express (REST API), `@grpc/grpc-js` (gRPC Server), MongoDB 8 (`mongoose`)
- **Backend Service B (JavaScript)**: Node.js 22, Express, `@grpc/grpc-js` (gRPC Client `WatchRecords` stream), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **Frontend (JavaScript/TypeScript)**: Angular 20 SPA
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search Engine**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Codebase Composition (Pure JavaScript)

```
/frontend             Angular 20 app (REST client)
/backend-service-a    Node.js 22 JavaScript service — gRPC server (`RecordService`), Express REST API, MongoDB ORM
/backend-service-b    Node.js 22 JavaScript service — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto         .proto contract defining gRPC interface between JavaScript services
docker-compose.yml    Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

## Install & Run Commands

```bash
# 1. Start backend containers
docker compose up -d

# 2. Start JavaScript Service A
cd backend-service-a
npm install
npm start

# 3. Start JavaScript Service B
cd backend-service-b
npm install
npm start

# 4. Start Frontend
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

    run_cmd("git checkout CE-001", repo_dir)

    for branch_name, runtime, ts_pkg, arch in BRANCHES:
        print(f"--> Creating & Pushing branch {branch_name} ({runtime} / {ts_pkg} / {arch})...")
        run_cmd(f"git checkout -B {branch_name}", repo_dir)
        
        readme_path = os.path.join(repo_dir, "README.md")
        content = README_TEMPLATE.format(
            branch_name=branch_name,
            runtime=runtime,
            ts_pkg=ts_pkg,
            arch=arch
        )
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        run_cmd("git add README.md", repo_dir)
        run_cmd(f'git commit -m "{branch_name}: JavaScript ({ts_pkg}) - {arch}"', repo_dir)
        run_cmd(f"git push -u origin {branch_name} --force", repo_dir)
        print(f"    Pushed {branch_name} to origin.")

    run_cmd("git checkout main", repo_dir)

if __name__ == "__main__":
    main()
