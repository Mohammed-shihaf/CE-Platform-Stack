# CE-NEW-JSTS-001

## Metadata
* **Branch:** `CE-NEW-JSTS-001`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Monolith
* **Build Tool:** Vite 5.3+ (standalone) + Node.js
* **Package Manager:** npm (genuine `package-lock.json`)
* **Frameworks:** React 18+ (Vite SPA) + Node.js (Express API)

---

## Monolith Enterprise Layered Architecture
This repository implements a canonical fullstack **Layered Enterprise Monolith**:
* **Presentation Layer (`src/client`)**: React 18 SPA with Dashboard, Order Lifecycle, Tax Calculator, and System Status.
* **Controller Layer (`src/server/controllers`)**: Express REST route controllers with input validation.
* **Domain Service Layer (`src/server/services`)**: Core business logic containing:
  - Enterprise tax settlement with intentional Type-1 structural duplication (`TaxCalculationServiceA.ts` vs `TaxCalculationServiceB.ts`).
  - High cyclomatic complexity tiered rebate engine (`PricingEngine.ts`).
  - High cognitive complexity async audit and reconciliation state machine (`ReconciliationProcessor.ts`).
* **Data Access / Repository Layer (`src/server/repositories`)**:
  - Raw SQL data store with SQL injection vulnerability (`OrderRepository.ts`).
  - File retrieval system with path traversal vulnerability (`DocumentRepository.ts`).
* **Integration & Security Layer (`src/server/config` & `diagnostics`)**:
  - Payment gateway API integration with hardcoded credentials (`paymentGatewayConfig.ts`).
  - Diagnostic network ping endpoint with command injection vulnerability (`DiagnosticsController.ts`).
