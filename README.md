# Recursive Coders Platform

A scalable, multi-tenant training and campus recruitment lifecycle platform engineered for technical academies, universities, and enterprise hiring pipelines. The system coordinates candidate skill evaluation, batch cohort management, isolated multi-language code execution, anti-cheat proctored assessment arenas, campus placement drives, and historical company interview question archives.

---

## Architecture and System Design

A complete architectural specification including C4 component diagrams, entity-relationship diagrams, sandbox security boundaries, and proctoring sequence flows is available in [System Design Specification](docs/system-design.md). Additional operational documentation includes:
- [Architecture Overview](docs/architecture.md)
- [Production Deployment Runbook](docs/deployment.md)
- [Architectural Decision Records (ADRs)](docs/decisions.md)
- [REST API Conventions](docs/api-conventions.md)

---

## Technology Stack

- **Monorepo Architecture**: pnpm workspaces with Turborepo task pipeline
- **Backend Service**: Java 21 OpenJDK, Spring Boot 3.3.4, Spring Data JPA, PostgreSQL 16, Flyway Migrations, Spring Security (JWT with Refresh Token rotation), Springdoc OpenAPI 3.0, MapStruct, Lombok, OpenCSV
- **Web Application**: React 18, Vite, TypeScript (strict mode), TanStack Query, React Router v6, Tailwind CSS, Lucide Icons, Monaco Editor, Axios
- **Isolated Code Execution**: Self-hosted Judge0 sandbox in isolated Docker containers with local native fallback runner
- **Supported Execution Languages**:
  - Python 3.10 (Judge0 ID 71)
  - Java 21 (OpenJDK 21.0.2, Judge0 ID 91 / 62)
  - JavaScript (Node.js 20, Judge0 ID 63)
  - C++ (GCC 13.2, Judge0 ID 54)
- **Continuous Integration**: GitHub Actions multi-stage build, lint, and test validation

---

## Repository Structure

```
placement-platform/
├── apps/
│   ├── web/                      # React 18 + TypeScript client (Student, Trainer, Admin portals)
│   └── api/                      # Spring Boot 3.3.4 modular monolith service
├── packages/
│   ├── ui/                       # Shared UI components and theme tokens
│   └── config/                   # Shared TypeScript, ESLint, and Prettier configurations
├── infra/
│   ├── docker-compose.yml        # PostgreSQL 16 and Judge0 sandbox stack
│   └── judge0/                   # Judge0 configuration parameters
├── docs/                         # System design, architecture, deployment, and ADRs
└── .github/workflows/ci.yml      # CI pipeline configuration
```

---

## Role-Based Access Control and Seed Credentials

The platform enforces strict role-based authorization across three distinct personas: `STUDENT`, `TRAINER`, and `ADMIN`.

| Persona | Default Email | Default Password | Initial Action Required |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@company.com` | `AdminPassword123!` | None |
| **Assigned Trainer** | Configured by Admin | `Welcome@2026!` | Forced password update on first login |
| **Enrolled Student** | Configured by Admin / CSV | `Welcome@2026!` | Forced password update on first login |

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20 or higher (tested on Node.js v22)
- **pnpm**: v10 or higher (`npm install -g pnpm`)
- **Java**: OpenJDK 21
- **Docker & Docker Compose** (optional for Judge0 container sandbox)

### 2. Configure Environment
Create the local environment definition file:
```bash
cp .env.example .env
```

### 3. Launch Database Service
Start the PostgreSQL 16 service:
```bash
cd infra
docker compose up -d postgres
```
*(To launch the full self-hosted Judge0 sandbox alongside PostgreSQL, run `docker compose --profile full up -d`)*

### 4. Start the Backend API Service
From the repository root or `apps/api`:
```bash
cd apps/api
# Runs Flyway migrations and starts the service on port 8080
.\mvnw.cmd spring-boot:run
```
- Base API URL: `http://localhost:8080`
- Service Health Probe: `http://localhost:8080/api/v1/health`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI Specification: `http://localhost:8080/v3/api-docs`

### 5. Start the Web Client
From the repository root:
```bash
# Install workspace dependencies
pnpm install

# Start the Vite development server
pnpm --filter @placement/web run dev
```
Access the application at `http://localhost:5173`.

---

## Verification and Testing

### Backend Unit and Integration Tests (46 Tests)
```bash
cd apps/api
.\mvnw.cmd test
```

### Frontend TypeScript Verification and Production Build
```bash
pnpm --filter @placement/web run build
```

---

## Core Feature Overview

### 1. Multi-Language Code Execution Sandbox
Candidates solve algorithmic problems using Python 3.10, Java 21, JavaScript Node.js 20, or C++ GCC 13. Code editors offer clean, blank function signatures without exposing pre-filled answers or algorithms. Execution provides real-time stdin feedback, runtime measurements in milliseconds, and memory consumption metrics.

### 2. Company Previous Questions Archive
A dedicated repository of authentic past interview questions categorized by hiring organizations (Amazon, Google, Microsoft, TCS Digital, Infosys), interview rounds (Online Coding Assessment, Technical Round 1, Technical Round 2), difficulty levels, and compensation tiers. Students can review interview guidance, sample test cases, and launch problems directly in the interactive IDE.

### 3. Anti-Cheat Proctored Assessments
Timed mock assessments feature a real-time integrity monitoring pipeline:
- Tab blur, window minimize, and multi-monitor movement detection.
- Copy and paste prevention within problem editors.
- Automated progressive warnings (3 strikes threshold) culminating in candidate disqualification.
- Live proctoring radar allowing trainers and administrators to inspect active candidate statuses, elapsed time, and strike tallies.

### 4. Asia/Kolkata Activity Streaks and Scoring
Activity heatmaps and consecutive practice streaks are calculated strictly against the `Asia/Kolkata` (UTC+05:30) timezone, eliminating calendar skew from server UTC timestamps. Cohort and global leaderboards highlight top performers across solved problem counts and total score.

### 5. Placement Recruitment Drives
Management of campus and pool drives with automated eligibility filters based on minimum CGPA, active academic backlogs, and graduation year. Students can track their application lifecycle across four stages: Registered, Shortlisted, Interview Scheduled, and Offer Extended.

### 6. Administrative Impersonation and Audit Logs
Administrators can initiate read-only impersonation sessions to inspect student dashboards directly while logging all actions to an immutable database audit log.

---

## REST API Reference

### Authentication and Identity
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticate with credentials and receive JWT pair |
| `POST` | `/api/v1/auth/refresh` | Public | Exchange refresh token for renewed access token |
| `POST` | `/api/v1/auth/change-password` | Authenticated | Update user password and clear forced change flag |
| `POST` | `/api/v1/auth/impersonate/{userId}` | `ADMIN` | Issue scoped impersonation token for candidate inspection |

### Cohort and Student Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/batches` | `ADMIN` | Create a training cohort batch |
| `GET` | `/api/v1/batches` | Authenticated | List batches with status, trainer, and search criteria |
| `GET` | `/api/v1/batches/{id}/students` | `ADMIN`, `TRAINER` | View enrolled students in cohort |
| `POST` | `/api/v1/batches/{id}/students` | `ADMIN` | Enroll students into cohort |
| `GET` | `/api/v1/students/profile` | `STUDENT` | Retrieve academic profile and completeness score |
| `PUT` | `/api/v1/students/profile` | `STUDENT` | Update academic records, technical skills, and links |
| `POST` | `/api/v1/students/profile/resume` | `STUDENT` | Upload candidate resume document (PDF/DOCX, max 5MB) |

### Problem Catalog and Batch Assignments
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/questions` | `ADMIN`, `TRAINER` | Create problem with sample and hidden test suites |
| `GET` | `/api/v1/questions` | Authenticated | List problems with difficulty, tag, and search filters |
| `GET` | `/api/v1/questions/{id}` | Authenticated | Retrieve problem description (hidden tests masked for students) |
| `POST` | `/api/v1/assignments` | `ADMIN`, `TRAINER` | Create batch assignment with scheduled deadlines |
| `GET` | `/api/v1/assignments/my-assignments` | `STUDENT` | Retrieve active assignments for enrolled cohorts |

### Code Execution and Practice
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/submissions/run` | Authenticated | Test code against sample cases or custom stdin |
| `POST` | `/api/v1/submissions/submit` | Authenticated | Submit code against all test cases and record verdict |
| `GET` | `/api/v1/submissions/my` | Authenticated | List candidate submission history and verdicts |
| `GET` | `/api/v1/submissions/{id}` | Authenticated | Retrieve per-test case execution breakdown |

### Assessments and Proctoring
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/assessments` | `ADMIN`, `TRAINER` | Create timed mock assessment or coding contest |
| `GET` | `/api/v1/assessments` | Authenticated | List assessments with status and eligibility criteria |
| `POST` | `/api/v1/assessments/{id}/start` | `STUDENT` | Begin proctored assessment attempt |
| `POST` | `/api/v1/assessments/{id}/violations` | `STUDENT` | Record proctoring infraction (tab blur, copy-paste) |
| `POST` | `/api/v1/assessments/{id}/submit` | `STUDENT` | Finalize assessment attempt and compute score |
| `GET` | `/api/v1/assessments/{id}/roster` | `ADMIN`, `TRAINER` | Inspect live proctoring radar with strike indicators |

### Placement Recruitment Drives
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/placements/drives` | Authenticated | List recruitment drives with eligibility indicators |
| `GET` | `/api/v1/placements/drives/{id}` | Authenticated | Get placement drive details by ID |
| `POST` | `/api/v1/placements/drives` | `ADMIN`, `TRAINER` | Create campus recruitment drive |
| `PUT` | `/api/v1/placements/drives/{id}` | `ADMIN`, `TRAINER` | Update existing placement drive details, package, or status |
| `DELETE` | `/api/v1/placements/drives/{id}` | `ADMIN`, `TRAINER` | Delete recruitment drive and associated applications |
| `POST` | `/api/v1/placements/drives/{id}/apply` | `STUDENT` | Submit student drive application |
| `GET` | `/api/v1/placements/drives/{id}/applications` | `ADMIN`, `TRAINER` | Review applicant roster for a drive |
| `PATCH` | `/api/v1/placements/applications/{id}/status` | `ADMIN`, `TRAINER` | Advance candidate hiring stage and interview notes |

---

## Engineering Standards

- **Zero Inline Secrets**: Environment variables and Spring configuration properties manage all database credentials and JWT signing keys.
- **Strict Separation of Concerns**: Clean isolation between client views and server-side evaluation engines.
- **Professional User Interface**: Clean typography, curated dark/light palettes, and Lucide SVG iconography across all user portals.
