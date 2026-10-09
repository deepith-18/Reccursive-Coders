# Architecture Decision Records (ADRs)

## ADR-0001: Monorepo Structure with pnpm Workspaces & Turborepo
- **Date**: 2026-10-09
- **Status**: Accepted
- **Context**: Need unified versioning, single-source code sharing, and coordinated builds between Spring Boot backend and React web client.
- **Decision**: Adopt pnpm workspaces with Turborepo for fast caching and pipeline task execution.

## ADR-0002: Modular Monolith (Package-by-Feature)
- **Date**: 2026-10-09
- **Status**: Accepted
- **Context**: Microservices introduce excessive operational complexity for an early-stage multi-role platform.
- **Decision**: Structure the Spring Boot backend by feature domain (`auth`, `user`, `batch`, `question`, `assignment`, `execution`, `scoring`, `placement`) rather than technical layers (`controllers`, `services`, `repositories`).

## ADR-0003: Code-Generated TypeScript Client via OpenAPI
- **Date**: 2026-10-09
- **Status**: Accepted
- **Context**: Manually writing TypeScript interfaces creates drift and type errors when backend DTOs evolve.
- **Decision**: Generate Axios-based TypeScript clients via OpenAPI spec export (`pnpm generate-api`). The backend automatically exports the specification during test execution.

## ADR-0004: Code Execution Sandbox Isolation via Judge0
- **Date**: 2026-10-09
- **Status**: Accepted
- **Context**: Running user-submitted code inside the application process is a severe security vulnerability.
- **Decision**: Self-host Judge0 in Docker containers (with Redis queue and worker processes) invoked strictly via backend REST API.

## ADR-0005: Database Migrations with Flyway
- **Date**: 2026-10-09
- **Status**: Accepted
- **Context**: Hibernate `ddl-auto: update` is unsafe for production and loses history.
- **Decision**: Hibernate `ddl-auto: validate` with Flyway sequential migrations (`V1__...`, `V2__...`).

## ADR-0006: JWT with Refresh Token Rotation & Hashed Storage
- **Date**: 2026-10-10
- **Status**: Accepted
- **Context**: Refresh tokens stored as plain text can be stolen if the database is compromised; refresh tokens without rotation can be replayed.
- **Decision**: Refresh tokens are cryptographically hashed (SHA-256) at rest in the `refresh_tokens` table. On every token refresh, the used token is revoked and a new pair is issued (Token Rotation).

## ADR-0007: Mandatory Force Password Change for Provisioned Accounts
- **Date**: 2026-10-10
- **Status**: Accepted
- **Context**: Admins and batch CSV imports provision accounts with temporary default passwords (`Welcome@2026!`). Users should never continue using known temporary passwords.
- **Decision**: The `force_password_change` boolean flag is asserted in JWT claims and database records. The frontend interceptor and `RoleGuard` block access to the dashboard until the user sets a new personal password via `POST /api/v1/auth/change-password`.
