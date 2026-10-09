# Training & Placement Platform

A comprehensive, role-based platform designed for training companies to manage students, trainers, assignments, code execution, scoring streaks, and recruitment drives.

---

## 🛠 Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Data JPA, PostgreSQL 16, Flyway, Spring Security (JWT + Refresh Tokens), Springdoc OpenAPI 3.0, MapStruct, Lombok, OpenCSV
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

## 🔑 Default Seed Credentials (Phase 1)

| Role | Email | Password | Force Password Change |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@company.com` | `AdminPassword123!` | No |
| **TRAINER (Created)** | *Assigned by Admin* | `Welcome@2026!` | Yes |
| **STUDENT (Created / CSV)** | *Assigned by Admin* | `Welcome@2026!` | Yes |

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
# Runs Flyway migrations (V1 baseline + V2 auth/users) and launches on port 8080
.\mvnw.cmd clean test spring-boot:run
```
- API Base URL: `http://localhost:8080`
- Health Endpoint: `http://localhost:8080/api/v1/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI Specification: `http://localhost:8080/v3/api-docs`

### 5. Run the Web Application
```bash
# Install dependencies from root
pnpm install

# (Optional) Re-generate TypeScript API client from backend OpenAPI spec
pnpm generate-api

# Start Vite dev server
pnpm --filter @placement/web run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
- Navigate to `/login` to sign in as Administrator or test student/trainer portals.

---

## 🧪 Testing

### Backend Unit & Integration Tests (16 tests)
```bash
cd apps/api
.\mvnw.cmd test
```

### Frontend Type-Checking & Production Build
```bash
pnpm --filter @placement/web run build
```

---

## 📡 API Endpoints Overview

### Phase 2: Cohorts & Student Profile
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/batches` | `ADMIN` | Create a new cohort batch |
| `GET` | `/api/v1/batches` | Authenticated | List batches with status, trainer, search filters |
| `GET` | `/api/v1/batches/{id}` | Authenticated | Get cohort overview details |
| `POST` | `/api/v1/batches/{id}/trainer` | `ADMIN` | Assign or change lead trainer |
| `GET` | `/api/v1/batches/{id}/students` | `ADMIN`, `TRAINER` | View cohort student roster |
| `POST` | `/api/v1/batches/{id}/students` | `ADMIN` | Enroll students into cohort |
| `DELETE` | `/api/v1/batches/{id}/students/{studentId}` | `ADMIN` | Remove student enrollment |
| `GET` | `/api/v1/batches/my-batch` | `STUDENT` | Get current student's enrolled batch |
| `GET` | `/api/v1/students/profile` | `STUDENT` | Get personal academic profile & completeness score |
| `PUT` | `/api/v1/students/profile` | `STUDENT` | Update degree, branch, CGPA, skills, social links |
| `POST` | `/api/v1/students/profile/resume` | `STUDENT` | Upload resume document (PDF/DOCX max 5MB) |
| `GET` | `/api/v1/students/profile/resume` | `STUDENT` | Download uploaded resume |
| `GET` | `/api/v1/students/{studentId}/profile` | `ADMIN`, `TRAINER` | Inspect candidate student profile |

---

## 📋 Roadmap & Phase Status
- [x] **Phase 0 - Foundation**: Monorepo skeleton, Spring Boot modular monolith, Flyway baseline, React app shell with Student/Trainer/Admin portals, Docker Compose, CI, and OpenAPI client generation.
- [x] **Phase 1 - Auth & RBAC**: Stateless JWT + refresh token rotation, password hashing, seeded admin, user creation, CSV bulk import, force-change-password, and audit log table.
- [x] **Phase 2 - Student Profile & Batches**: Batch CRUD, cohort schedules, trainer assignment, student roster enrollments, profile credentials builder, skills chip tagger, resume upload/download (PDF/DOCX max 5MB), and live completeness meter.
- [ ] **Phase 3 - Questions & Assignments**: Markdown question builder, sample & hidden test cases, assignments with deadlines.
- [ ] **Phase 4 - Coding Practice & Execution**: Judge0 sandbox, Monaco editor, Run vs Submit verdicts.
- [ ] **Phase 5 - Scoring & Engagement**: Asia/Kolkata streaks, GitHub activity heatmap, batch & global leaderboards.
- [ ] **Phase 6 - Admin Power Features**: Read-only student impersonation, cohort progress analytics, and weak topics radar.
- [ ] **Phase 7 - Placement Module**: Recruitment drives, eligibility criteria, and application pipelines.
- [ ] **Phase 8 - Hardening & Deploy**: OWASP security review, rate limits, Testcontainers, and production Docker builds.
