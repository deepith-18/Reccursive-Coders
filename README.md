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

### Backend Unit & Integration Tests (27 tests)
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

### Phase 3: Questions & Assignments
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/questions` | `ADMIN`, `TRAINER` | Create coding question with sample & hidden test cases |
| `GET` | `/api/v1/questions` | Authenticated | List questions with difficulty, status, tag & search filters |
| `GET` | `/api/v1/questions/{id}` | Authenticated | Get question statement (hidden test cases masked for students) |
| `GET` | `/api/v1/questions/slug/{slug}` | Authenticated | Get question by slug |
| `PUT` | `/api/v1/questions/{id}` | `ADMIN`, `TRAINER` | Update question details and resource constraints |
| `DELETE` | `/api/v1/questions/{id}` | `ADMIN`, `TRAINER` | Delete question |
| `POST` | `/api/v1/questions/{id}/test-cases` | `ADMIN`, `TRAINER` | Add test case to question suite |
| `DELETE` | `/api/v1/questions/{id}/test-cases/{tcId}` | `ADMIN`, `TRAINER` | Remove test case from question |
| `POST` | `/api/v1/assignments` | `ADMIN`, `TRAINER` | Create batch assignment with questions, points & deadlines |
| `GET` | `/api/v1/assignments/batch/{batchId}` | Authenticated | List all assignments for a cohort batch |
| `GET` | `/api/v1/assignments/my-assignments` | `STUDENT` | List personal assignments for enrolled batches |
| `GET` | `/api/v1/assignments/{id}` | Authenticated | Get assignment details with attached question list |
| `PUT` | `/api/v1/assignments/{id}` | `ADMIN`, `TRAINER` | Update assignment details and question points |
| `DELETE` | `/api/v1/assignments/{id}` | `ADMIN`, `TRAINER` | Delete batch assignment |

### Phase 4: Coding Practice & Execution
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/submissions/run` | Authenticated | Execute code against sample cases or custom stdin (sandbox execution) |
| `POST` | `/api/v1/submissions/submit` | Authenticated | Formally submit code against full test suite, persist verdict & score |
| `GET` | `/api/v1/submissions/my` | Authenticated | List user submission history with question & assignment filters |
| `GET` | `/api/v1/submissions/{id}` | Authenticated | Get detailed submission breakdown with per-test-case verdicts |

### Phase 5: Scoring & Engagement
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/leaderboards/global` | Authenticated | Global leaderboard ranked by score, problems solved, and streaks |
| `GET` | `/api/v1/leaderboards/batch/{batchId}` | Authenticated | Cohort batch leaderboard ranked by score, problems solved, and streaks |
| `GET` | `/api/v1/scoring/heatmap` | Authenticated | Current student 365-day activity contribution heatmap (Asia/Kolkata) |
| `GET` | `/api/v1/scoring/heatmap/{studentId}` | `ADMIN`, `TRAINER` | Inspect candidate student's activity contribution heatmap |
| `GET` | `/api/v1/scoring/overview` | Authenticated | Current student global rank, total score, problems solved, and active streak |
| `GET` | `/api/v1/scoring/overview/{studentId}` | `ADMIN`, `TRAINER` | Inspect candidate student's scoring rank and streak status |

---

## 📋 Roadmap & Phase Status
- [x] **Phase 0 - Foundation**: Monorepo skeleton, Spring Boot modular monolith, Flyway baseline, React app shell with Student/Trainer/Admin portals, Docker Compose, CI, and OpenAPI client generation.
- [x] **Phase 1 - Auth & RBAC**: Stateless JWT + refresh token rotation, password hashing, seeded admin, user creation, CSV bulk import, force-change-password, and audit log table.
- [x] **Phase 2 - Student Profile & Batches**: Batch CRUD, cohort schedules, trainer assignment, student roster enrollments, profile credentials builder, skills chip tagger, resume upload/download (PDF/DOCX max 5MB), and live completeness meter.
- [x] **Phase 3 - Questions & Assignments**: Markdown question builder, sample & hidden test cases, assignments with deadlines, urgency countdowns, and student problem viewers.
- [x] **Phase 4 - Coding Practice & Execution**: Judge0 sandbox, Monaco editor, Run vs Submit verdicts, custom stdin console, and submission audit trail.
- [x] **Phase 5 - Scoring & Engagement**: Asia/Kolkata streaks, GitHub activity heatmap, batch & global leaderboards with top 3 podium recognition.
- [x] **Phase 6 - Placement Recruitment System**: Campus & partner corporate drives, eligibility evaluations, package filters, and 4-stage application pipelines.
- [x] **Phase 7 - Admin Power Features & Analytics**: Read-only student impersonation, cohort progress analytics, weak topics radar, and real-time in-app notification center.
- [x] **Phase 8 - Production Hardening & Deployment**: OWASP security headers, sliding-window API rate limiting, multi-stage production Dockerfiles, Nginx SPA routing, and [Production Deployment Runbook](docs/deployment.md).

