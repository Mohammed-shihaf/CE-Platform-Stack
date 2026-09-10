import os
import subprocess

CS_BRANCHES = [
    # Standalone C#
    ("CE-CS-001", "C# (.NET 8.0)", "dotnet CLI", "NuGet", "Monolith", "C# ASP.NET Core gRPC Server & Client + Mongo + Angular single solution"),
    ("CE-CS-002", "C# (.NET 8.0)", "dotnet CLI", "NuGet", "Microservices", "Decoupled C# Service A + C# Service B + Angular Frontend"),
    ("CE-CS-003", "C# (.NET 9.0)", "MSBuild", "CPM (Directory.Packages.props)", "Monolith", "Modular Clean Architecture .NET 9 solution"),
    ("CE-CS-004", "C# (.NET 8.0)", "Cake (C# Make)", "Paket", "Microservices", "C# Cake build script + Paket dependency lock"),
    ("CE-CS-005", "C# (.NET 9.0)", "Nuke", "NuGet", "Microservices", "Strongly-typed Nuke build system + C# gRPC Mesh"),

    # Python + C#
    ("CE-PYCS-001", "Python + C#", "setuptools / dotnet CLI", "npm / NuGet", "Monolith", "Python (FastAPI/gRPC) + C# ASP.NET Core gRPC single workspace"),
    ("CE-PYCS-002", "Python + C#", "setuptools / dotnet CLI", "npm / NuGet", "Microservices", "Decoupled Python Service A + C# Service B + Angular Frontend"),
    ("CE-PYCS-003", "Python + C#", "poetry / MSBuild", "pnpm / Paket", "Monolith", "Python (Poetry) + C# (MSBuild) single workspace"),
    ("CE-PYCS-004", "Python + C#", "flit / Cake", "bun / NuGet", "Microservices", "Decoupled Python Service A (Flit) + C# Service B (Cake)"),
    ("CE-PYCS-005", "Python + C#", "uv / Nuke", "npm esbuild / NuGet", "Microservices", "Decoupled Python Service A (uv) + C# Service B (Nuke)"),

    # C# + Pure JavaScript
    ("CE-CSJS-001", "C# + Pure JavaScript", "dotnet CLI", "npm", "Monolith", "C# ASP.NET Core gRPC Server + Node.js 22 JS Client single workspace"),
    ("CE-CSJS-002", "C# + Pure JavaScript", "dotnet CLI", "npm", "Microservices", "Decoupled C# Service A + Pure JS Service B + JS Frontend"),
    ("CE-CSJS-003", "C# + Pure JavaScript", "MSBuild", "pnpm", "Monolith", "C# MSBuild + Node.js 22 JS (pnpm workspace)"),
    ("CE-CSJS-004", "C# + Pure JavaScript", "Cake", "yarn (Berry)", "Microservices", "Decoupled C# Service A (Cake) + Pure JS Service B (Yarn)"),
    ("CE-CSJS-005", "C# + Pure JavaScript", "Nuke", "bun", "Microservices", "Decoupled C# Service A (Nuke) + Pure JS Service B (Bun)"),

    # C# + TypeScript
    ("CE-CSTS-001", "C# + TypeScript", "dotnet CLI", "npm", "Monolith", "C# ASP.NET Core gRPC Server + Node.js 22 TS Client + Angular TS single workspace"),
    ("CE-CSTS-002", "C# + TypeScript", "dotnet CLI", "npm", "Microservices", "Decoupled C# Service A + TS Service B + Angular TS Frontend"),
    ("CE-CSTS-003", "C# + TypeScript", "MSBuild", "pnpm", "Monolith", "C# MSBuild + TS (pnpm workspace)"),
    ("CE-CSTS-004", "C# + TypeScript", "Cake", "yarn (Berry)", "Microservices", "Decoupled C# Service A (Cake) + TS Service B (Yarn) + Angular TS Frontend"),
    ("CE-CSTS-005", "C# + TypeScript", "Nuke", "bun", "Microservices", "Decoupled C# Service A (Nuke) + TS Service B (Bun) + Angular TS Frontend"),
]

README_TEMPLATE = """# CE-Platform-Stack — branch {branch_name}

Testbed reference repository for validating a code-scanning platform against
a locked **{primary_pair}** technology stack (**C# .NET 8.0 / .NET 9.0**).

This branch is part of the `CE-CS`, `CE-PYCS`, `CE-CSJS`, and `CE-CSTS` C# matrices:

| Branch | Primary Pair | C# / Language Build Tool | Package Manager | Project Structure |
|---|---|---|---|---|
| `{branch_name}` | {primary_pair} | {build_tool} | {pkg_mgr} | **{arch}** |

## Technology Baseline ({primary_pair})

All core technologies are genuinely wired and exercised on this branch:
- **C# Service A**: .NET 8.0 / .NET 9.0, ASP.NET Core Kestrel Web Server, `Grpc.AspNetCore` (gRPC Server), MongoDB ORM (`MongoDB.Driver`), Security Code Scan Roslyn Analyzers
- **Service B**: gRPC Client (`WatchRecords` stream), Elasticsearch 8, AWS SNS (LocalStack), AWS SES (LocalStack)
- **Frontend**: Angular 20 SPA
- **Database**: MongoDB 8 (Docker container `ce-mongo`)
- **Search Engine**: Elasticsearch 8 (Docker container `ce-elasticsearch`)
- **Queue & Mail**: AWS SNS + AWS SES (LocalStack container `ce-localstack`)
- **Inter-service Protocol**: gRPC (`shared/proto/record.proto`)

## Codebase Composition

```
/frontend             Angular 20 app (REST client)
/backend-cs-service-a C# .NET 8.0 / .NET 9.0 service — gRPC server (`RecordService`), Kestrel REST API, Roslyn Analyzers
/backend-service-b    Service B — gRPC client (`WatchRecords` stream), Elasticsearch, SNS/SES
/shared/proto         .proto contract defining gRPC interface
docker-compose.yml    Mongo 8 + Elasticsearch 8 + LocalStack (SNS/SES/SQS)
```

## Install & Run Commands

```bash
# 1. Start backend containers
docker compose up -d

# 2. Start C# Service A
cd backend-cs-service-a
dotnet build
dotnet run

# 3. Start Service B
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

    run_cmd("git checkout main", repo_dir)
    run_cmd("git add -A", repo_dir)
    run_cmd('git commit -m "add C# backend-cs-service-a implementation and shared proto"', repo_dir)

    for branch_name, primary_pair, build_tool, pkg_mgr, arch, desc in CS_BRANCHES:
        print(f"--> Creating & Pushing branch {branch_name} ({primary_pair} / {build_tool} / {pkg_mgr} / {arch})...")
        run_cmd(f"git checkout -B {branch_name}", repo_dir)
        
        readme_path = os.path.join(repo_dir, "README.md")
        content = README_TEMPLATE.format(
            branch_name=branch_name,
            primary_pair=primary_pair,
            build_tool=build_tool,
            pkg_mgr=pkg_mgr,
            arch=arch
        )
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        run_cmd("git add README.md", repo_dir)
        run_cmd(f'git commit -m "{branch_name}: {primary_pair} ({build_tool}) - {arch}"', repo_dir)
        run_cmd(f"git push -u origin {branch_name} --force", repo_dir)
        print(f"    Pushed {branch_name} to origin.")

    run_cmd("git checkout main", repo_dir)

if __name__ == "__main__":
    main()
