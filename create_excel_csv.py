import csv
import os

BASE_URL = "https://github.com/Mohammed-shihaf/CE-Platform-Stack/tree/"

rows = []

# Version Constants
VER_NODE = "Node.js 22.0.0+"
VER_BUN = "Bun 1.1.x"
VER_PYTHON = "Python 3.11+"
VER_ANGULAR = "Angular 20.0.0"
VER_MONGO = "MongoDB 8.0 (mongo:8)"
VER_ES = "Elasticsearch 8.15.3"
VER_AWS = "LocalStack 3.0 (SNS/SES/SQS)"
VER_GRPC = "@grpc/grpc-js 1.11.3 / grpcio 1.62.0"

# 1. Python + Pure JavaScript Dual-Language Matrix (CE-PYJS-001 .. CE-PYJS-010)
pyjs_matrix = [
    ("CE-PYJS-001", "Python + Pure JavaScript", "setuptools (v69.0)", "npm (v10.x)", "Monolith", "Python (FastAPI 0.110/gRPC) + Pure JS (Node 22/Express) single workspace"),
    ("CE-PYJS-002", "Python + Pure JavaScript", "setuptools (v69.0)", "npm (v10.x)", "Microservices", "Decoupled Python Service A + Pure JS Service B + JS Frontend"),
    ("CE-PYJS-003", "Python + Pure JavaScript", "poetry (v1.8)", "pnpm (v9.x)", "Monolith", "Python (Poetry) + Pure JS (pnpm workspace) single workspace"),
    ("CE-PYJS-004", "Python + Pure JavaScript", "poetry (v1.8)", "pnpm (v9.x)", "Microservices", "Decoupled Python Service A (Poetry) + Pure JS Service B (pnpm)"),
    ("CE-PYJS-005", "Python + Pure JavaScript", "hatchling (v1.21)", "yarn Berry (v4.x)", "Monolith", "Python (Hatchling) + Pure JS (Yarn Berry) single workspace"),
    ("CE-PYJS-006", "Python + Pure JavaScript", "hatchling (v1.21)", "yarn Berry (v4.x)", "Microservices", "Decoupled Python Service A (Hatch) + Pure JS Service B (Yarn)"),
    ("CE-PYJS-007", "Python + Pure JavaScript", "flit_core (v3.9)", "bun (v1.1.x)", "Monolith", "Python (Flit) + Pure JS (Bun runtime/packager) single workspace"),
    ("CE-PYJS-008", "Python + Pure JavaScript", "flit_core (v3.9)", "bun (v1.1.x)", "Microservices", "Decoupled Python Service A (Flit) + Pure JS Service B (Bun)"),
    ("CE-PYJS-009", "Python + Pure JavaScript", "uv (v0.1.0+)", "npm esbuild (v0.20)", "Monolith", "Python (uv runner) + Pure JS (esbuild) single workspace"),
    ("CE-PYJS-010", "Python + Pure JavaScript", "uv (v0.1.0+)", "npm esbuild (v0.20)", "Microservices", "Decoupled Python Service A (uv) + Pure JS Service B (esbuild)"),
]

for b, lang, py_tool, js_pkg, arch, desc in pyjs_matrix:
    runtime = VER_BUN if "bun" in js_pkg else VER_NODE
    rows.append({
        "Branch": b,
        "Matrix Group": "Python + Pure JavaScript Dual-Language",
        "Primary Language": lang,
        "Python Runtime Version": VER_PYTHON,
        "JS/TS Runtime Version": runtime,
        "Python Build Tool & Version": py_tool,
        "JS/TS Package Manager & Version": js_pkg,
        "Frontend Framework Version": VER_ANGULAR,
        "Database Version": VER_MONGO,
        "Search Engine Version": VER_ES,
        "Queue & Email Service Version": VER_AWS,
        "gRPC Protocol Version": VER_GRPC,
        "Project Structure": arch,
        "GitHub Branch URL": f"{BASE_URL}{b}",
        "Description": desc
    })

# 2. Python + TypeScript Dual-Language Matrix (CE-PYTS-001 .. CE-PYTS-010)
pyts_matrix = [
    ("CE-PYTS-001", "Python + TypeScript", "setuptools (v69.0)", "npm (v10.x)", "Monolith", "Python (FastAPI/gRPC) + TS (Express/Angular 20) unified workspace"),
    ("CE-PYTS-002", "Python + TypeScript", "setuptools (v69.0)", "npm (v10.x)", "Microservices", "Decoupled Python Service A + TS Service B + Angular TS Frontend"),
    ("CE-PYTS-003", "Python + TypeScript", "poetry (v1.8)", "pnpm (v9.x)", "Monolith", "Python (Poetry) + TS (pnpm workspace) unified workspace"),
    ("CE-PYTS-004", "Python + TypeScript", "poetry (v1.8)", "pnpm (v9.x)", "Microservices", "Decoupled Python Service A (Poetry) + TS Service B (pnpm) + Angular TS Frontend"),
    ("CE-PYTS-005", "Python + TypeScript", "hatchling (v1.21)", "yarn Berry (v4.x)", "Monolith", "Python (Hatchling) + TS (Yarn Berry) unified workspace"),
    ("CE-PYTS-006", "Python + TypeScript", "hatchling (v1.21)", "yarn Berry (v4.x)", "Microservices", "Decoupled Python Service A (Hatch) + TS Service B (Yarn) + Angular TS Frontend"),
    ("CE-PYTS-007", "Python + TypeScript", "flit_core (v3.9)", "bun (v1.1.x)", "Monolith", "Python (Flit) + TS (Bun runtime/packager) unified workspace"),
    ("CE-PYTS-008", "Python + TypeScript", "flit_core (v3.9)", "bun (v1.1.x)", "Microservices", "Decoupled Python Service A (Flit) + TS Service B (Bun) + Angular TS Frontend"),
    ("CE-PYTS-009", "Python + TypeScript", "uv (v0.1.0+)", "npm esbuild (v0.20)", "Monolith", "Python (uv runner) + TS (esbuild) unified workspace"),
    ("CE-PYTS-010", "Python + TypeScript", "uv (v0.1.0+)", "npm esbuild (v0.20)", "Microservices", "Decoupled Python Service A (uv) + TS Service B (esbuild) + Angular TS Frontend"),
]

for b, lang, py_tool, ts_pkg, arch, desc in pyts_matrix:
    runtime = VER_BUN if "bun" in ts_pkg else VER_NODE
    rows.append({
        "Branch": b,
        "Matrix Group": "Python + TypeScript Dual-Language",
        "Primary Language": lang,
        "Python Runtime Version": VER_PYTHON,
        "JS/TS Runtime Version": runtime,
        "Python Build Tool & Version": py_tool,
        "JS/TS Package Manager & Version": ts_pkg,
        "Frontend Framework Version": VER_ANGULAR,
        "Database Version": VER_MONGO,
        "Search Engine Version": VER_ES,
        "Queue & Email Service Version": VER_AWS,
        "gRPC Protocol Version": VER_GRPC,
        "Project Structure": arch,
        "GitHub Branch URL": f"{BASE_URL}{b}",
        "Description": desc
    })

# 3. Pure JavaScript Matrix (CE-JS-001 .. CE-JS-010)
js_matrix = [
    ("CE-JS-001", "Pure JavaScript", "N/A", "npm (v10.x)", "Monolith", "Node.js 22 JS gRPC Server & Client + Angular Frontend single workspace"),
    ("CE-JS-002", "Pure JavaScript", "N/A", "npm (v10.x)", "Microservices", "Decoupled JS Service A + JS Service B + Angular Frontend"),
    ("CE-JS-003", "Pure JavaScript", "N/A", "pnpm (v9.x)", "Monolith", "Node.js 22 JS (pnpm workspace) single workspace"),
    ("CE-JS-004", "Pure JavaScript", "N/A", "pnpm (v9.x)", "Microservices", "Decoupled JS Service A (pnpm) + JS Service B (pnpm)"),
    ("CE-JS-005", "Pure JavaScript", "N/A", "yarn Berry (v4.x)", "Monolith", "Node.js 22 JS (Yarn Berry workspace) single workspace"),
    ("CE-JS-006", "Pure JavaScript", "N/A", "yarn Berry (v4.x)", "Microservices", "Decoupled JS Service A (Yarn) + JS Service B (Yarn)"),
    ("CE-JS-007", "Pure JavaScript", "N/A", "bun (v1.1.x)", "Monolith", "Bun JS runtime/packager single workspace"),
    ("CE-JS-008", "Pure JavaScript", "N/A", "bun (v1.1.x)", "Microservices", "Decoupled Bun JS Service A + Bun JS Service B"),
    ("CE-JS-009", "Pure JavaScript", "N/A", "npm esbuild (v0.20)", "Monolith", "Node.js 22 JS + esbuild bundler single workspace"),
    ("CE-JS-010", "Pure JavaScript", "N/A", "npm esbuild (v0.20)", "Microservices", "Decoupled JS Service A (esbuild) + JS Service B (esbuild)"),
]

for b, lang, py_tool, ts_pkg, arch, desc in js_matrix:
    runtime = VER_BUN if "bun" in ts_pkg else VER_NODE
    rows.append({
        "Branch": b,
        "Matrix Group": "Pure JavaScript Matrix",
        "Primary Language": lang,
        "Python Runtime Version": "N/A",
        "JS/TS Runtime Version": runtime,
        "Python Build Tool & Version": "N/A",
        "JS/TS Package Manager & Version": ts_pkg,
        "Frontend Framework Version": VER_ANGULAR,
        "Database Version": VER_MONGO,
        "Search Engine Version": VER_ES,
        "Queue & Email Service Version": VER_AWS,
        "gRPC Protocol Version": VER_GRPC,
        "Project Structure": arch,
        "GitHub Branch URL": f"{BASE_URL}{b}",
        "Description": desc
    })

# 4. Original 6 Baseline Set (CE-A1..CE-A6)
ce_a = [
    ("CE-A1", "Node.js + Angular", "N/A", "esbuild (@angular/build) / npm v10", "Microservices", "Angular esbuild Application Builder + npm"),
    ("CE-A2", "Node.js + Angular", "N/A", "esbuild (@angular/build) / yarn Berry v4", "Microservices", "Angular esbuild Application Builder + yarn Berry"),
    ("CE-A3", "Node.js + Angular", "N/A", "esbuild (@angular/build) / pnpm v9", "Event-driven", "Angular esbuild Application Builder + pnpm"),
    ("CE-A4", "Node.js + Angular", "N/A", "Vite (esbuild) / bun v1.1", "Microservices", "Angular esbuild Application Builder + bun"),
    ("CE-A5", "Node.js + Angular", "N/A", "Webpack (@angular-devkit) / npm v10", "Microservices", "Angular Webpack legacy builder + npm"),
    ("CE-A6", "Node.js + Angular", "N/A", "Webpack (@angular-devkit) / pnpm v9", "Distributed System", "Angular Webpack legacy builder + pnpm"),
]

for b, lang, py_tool, ts_pkg, arch, desc in ce_a:
    runtime = VER_BUN if "bun" in ts_pkg else VER_NODE
    rows.append({
        "Branch": b,
        "Matrix Group": "Original 6 Baseline Set",
        "Primary Language": lang,
        "Python Runtime Version": "N/A",
        "JS/TS Runtime Version": runtime,
        "Python Build Tool & Version": "N/A",
        "JS/TS Package Manager & Version": ts_pkg,
        "Frontend Framework Version": VER_ANGULAR,
        "Database Version": VER_MONGO,
        "Search Engine Version": VER_ES,
        "Queue & Email Service Version": VER_AWS,
        "gRPC Protocol Version": VER_GRPC,
        "Project Structure": arch,
        "GitHub Branch URL": f"{BASE_URL}{b}",
        "Description": desc
    })

# 5. CE-001..CE-060
bundlers = ["esbuild (@angular/build)", "Vite (internal esbuild)", "Webpack (@angular-devkit)"]
pkg_mgrs = ["npm (v10.x)", "yarn Berry (v4.x)", "pnpm (v9.x)", "bun (v1.1.x)"]
archs = ["Monolith", "Modular Monolith", "Microservices", "Event-driven", "Distributed System"]

idx = 1
for bundler in bundlers:
    for pkg in pkg_mgrs:
        for arch in archs:
            b_name = f"CE-{idx:03d}"
            runtime = VER_BUN if "bun" in pkg else VER_NODE
            rows.append({
                "Branch": b_name,
                "Matrix Group": "Node/Angular Cross-Product Matrix",
                "Primary Language": "Node.js + Angular",
                "Python Runtime Version": "N/A",
                "JS/TS Runtime Version": runtime,
                "Python Build Tool & Version": "N/A",
                "JS/TS Package Manager & Version": f"{bundler} / {pkg}",
                "Frontend Framework Version": VER_ANGULAR,
                "Database Version": VER_MONGO,
                "Search Engine Version": VER_ES,
                "Queue & Email Service Version": VER_AWS,
                "gRPC Protocol Version": VER_GRPC,
                "Project Structure": arch,
                "GitHub Branch URL": f"{BASE_URL}{b_name}",
                "Description": f"Angular {bundler} + {pkg} package manager"
            })
            idx += 1

csv_path = r"C:\Users\moham\.gemini\antigravity\scratch\CE-Platform-Stack-Branch-Matrix.csv"
fieldnames = [
    "Branch", "Matrix Group", "Primary Language", "Python Runtime Version",
    "JS/TS Runtime Version", "Python Build Tool & Version", "JS/TS Package Manager & Version",
    "Frontend Framework Version", "Database Version", "Search Engine Version",
    "Queue & Email Service Version", "gRPC Protocol Version", "Project Structure",
    "GitHub Branch URL", "Description"
]

with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated CSV with {len(rows)} branch rows and complete version metadata at {csv_path}")
