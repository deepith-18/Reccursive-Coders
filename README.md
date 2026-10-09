# Training & Placement Platform

A comprehensive, role-based platform designed for training companies to manage students, trainers, assignments, code execution, scoring streaks, and recruitment drives.

---

## 🛠 Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Data JPA, PostgreSQL 16, Flyway, Springdoc OpenAPI 3.0, MapStruct, Lombok
- **Frontend**: React 18, Vite, TypeScript (strict), TanStack Query, React Router v6, Tailwind CSS, Lucide Icons, Axios
- **Code Execution**: Self-hosted Judge0 (Docker sandbox)
- **CI / Infra**: GitHub Actions CI, Docker Compose

---

## 📁 Repository Structure

```
placement-platform/
├── apps/
│   ├── web/                      # React 18 + TS client (Student, Trainer, Admin portals)
│   └── api/                      # Spring Boot 3.3 modular monolith backend
├── packages/
│   ├── ui/                       # Shared UI helper tokens and icons
│   └── config/                   # Shared tsconfig, eslint, prettier presets
├── infra/
│   ├── docker-compose.yml        # PostgreSQL 16 + Judge0 stack
│   └── judge0/                   # Judge0 sandbox configuration
├── docs/                         # Architecture, API conventions, and ADRs
└── .github/workflows/ci.yml      # Multi-stage CI pipeline
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ (tested on v22)
- **pnpm**: v10+ (`npm install -g pnpm`)
- **Java**: JDK 21
- **Docker & Docker Compose**

### 2. Environment Setup
Copy the template environment file:
```bash
cp .env.example .env
```

### 3. Start Infrastructure (PostgreSQL)
Start the database service:
```bash
cd infra
docker compose up -d postgres
```
*(To start Judge0 code execution alongside Postgres, run `docker compose --profile full up -d`)*

### 4. Run the Backend API
```bash
cd apps/api
./mvnw clean test spring-boot:run
```
- API Base URL: `http://localhost:8080`
- Health Endpoint: `http://localhost:8080/api/v1/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI Specification: `http://localhost:8080/v3/api-docs`

### 5. Run the Web Application
```bash
# Install dependencies from root
pnpm install

# Start Vite dev server
pnpm --filter @placement/web run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔄 OpenAPI Client Generation
To synchronize backend changes with the frontend TypeScript client:
```bash
pnpm generate-api
```
This updates `@/api/generated` models and services with zero type drift.

---

## 🧪 Testing

### Backend Unit & Context Tests
```bash
cd apps/api
./mvnw test
```

### Frontend Type-Checking & Production Build
```bash
pnpm --filter @placement/web run build
```

---

## 📋 Roadmap & Phase Status
- [x] **Phase 0 - Foundation**: Monorepo skeleton, Spring Boot modular monolith, Flyway baseline, React app shell with Student/Trainer/Admin portals, Docker Compose, CI, and OpenAPI client generation.
- [ ] **Phase 1 - Auth & RBAC**: JWT login/refresh, role guards, seeded admin, user creation, CSV bulk import, and audit logging.
- [ ] **Phase 2 - Student Profile & Batches**: Batch CRUD, profile credentials, resume upload, and trainer-to-batch assignment.
- [ ] **Phase 3 - Questions & Assignments**: Markdown question builder, sample & hidden test cases, assignments with deadlines.
- [ ] **Phase 4 - Coding Practice & Execution**: Judge0 sandbox, Monaco editor, Run vs Submit verdicts.
- [ ] **Phase 5 - Scoring & Engagement**: Asia/Kolkata streaks, GitHub activity heatmap, batch & global leaderboards.
- [ ] **Phase 6 - Admin Power Features**: Read-only student impersonation, cohort progress analytics, and weak topics radar.
- [ ] **Phase 7 - Placement Module**: Recruitment drives, eligibility criteria, and application pipelines.
- [ ] **Phase 8 - Hardening & Deploy**: OWASP security review, rate limits, Testcontainers, and production Docker builds.
