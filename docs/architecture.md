# Architecture Overview

## Monorepo Layout
The project is organized as a monorepo leveraging **pnpm workspaces** and **Turborepo**:

- **`apps/api`**: Spring Boot 3.3.x, Java 21, Spring Data JPA, PostgreSQL, Flyway, Spring Security, OpenAPI 3.0.
- **`apps/web`**: React 18, Vite, TypeScript strict, TanStack Query, React Router v6, Tailwind CSS.
- **`packages/config`**: Centralized TypeScript, ESLint, and Prettier configurations.
- **`packages/ui`**: Shared UI primitives and Tailwind helper tokens.
- **`infra/`**: Docker Compose configurations for PostgreSQL 16 and Judge0.

## Backend Modular Monolith
The backend uses a **package-by-feature** architectural pattern rather than package-by-layer:

```
com.company.placement/
├── common/        # Shared configs, error handler, audit, base entity, envelope
├── auth/          # Authentication & token services (Phase 1)
├── user/          # User entities, roles, and profiles (Phase 1 & 2)
├── batch/         # Cohort & batch management (Phase 2)
├── question/      # Problem statements & test cases (Phase 3)
├── assignment/    # Batch assignments & deadlines (Phase 3)
├── submission/    # Submissions & verdicts (Phase 4)
├── execution/     # Judge0 client and queue management (Phase 4)
├── scoring/       # Streaks, activity heatmap & leaderboard (Phase 5)
├── placement/     # Placement drives & student applications (Phase 7)
├── notification/  # In-app notifications (Phase 7)
└── analytics/     # Platform & cohort analytics (Phase 6)
```

## Security & Data Integrity
1. **Stateless JWT**: Access tokens (15m) and Refresh tokens (7d).
2. **Role-Based Access Control**: Standard roles: `STUDENT`, `TRAINER`, `ADMIN`. Method security via `@PreAuthorize("hasRole('...')")`.
3. **Audit Trail**: Entities inherit from `BaseEntity` providing UUID primary keys, created/updated timestamps, and optimistic locking `@Version`.
4. **Isolated Code Execution**: Code execution runs inside self-hosted Judge0 isolated Docker containers via internal HTTP client; user code is never run within the backend JVM process.
