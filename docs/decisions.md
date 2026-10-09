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
