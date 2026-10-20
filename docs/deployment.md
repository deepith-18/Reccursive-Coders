# 🚀 Production Deployment & Hardening Guide
## Recursive Coders Placement & Training Platform

This runbook outlines how to configure, harden, and deploy the entire Recursive Coders platform in production using Docker Compose, PostgreSQL 16, Spring Boot 3.3.4, and Nginx.

---

## 🏗️ 1. Architecture Overview

```
[ Client Browsers / HTTPS ]
            │
            ▼ (Port 443 / SSL)
   [ Reverse Proxy (Caddy / Cloudflare / Nginx) ]
            │
            ▼ (Port 80 / HTTP)
┌──────────────────────────────────────────────────────────────┐
│  placement-web (Nginx Alpine SPA Container)                  │
│  - Serves compiled React 18 assets with Gzip compression     │
│  - Reverse-proxies /api/* to placement-api:8080              │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│  placement-api (Eclipse Temurin 21 JRE Alpine)               │
│  - Stateless JWT token auth with Refresh Token Rotation      │
│  - RateLimitingFilter (Sliding window bucket protection)     │
│  - Security headers & Actuator health monitoring             │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
┌──────────────▼───────────────┐ ┌────────────▼────────────────┐
│  PostgreSQL 16 Database      │ │  Judge0 Code Execution Stack │
│  - Flyway migrations         │ │  - Isolated sandbox         │
│  - Persistent named volumes  │ │  - Redis queue + workers    │
└──────────────────────────────┘ └─────────────────────────────┘
```

---

## 📋 2. Production Environment Checklist (`.env`)

Create a `.env` file in the repository root based on this template:

```env
# Database Settings
POSTGRES_DB=placement_platform
POSTGRES_USER=recursive_admin
POSTGRES_PASSWORD=YOUR_STRONG_SECURE_PASSWORD_HERE

# Backend Security
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=GENERATE_A_MINIMUM_64_CHAR_HEX_SECRET_FOR_HS512_ALGORITHM
STORAGE_RESUME_PATH=/app/uploads/resumes

# Web Client Exposed Port
PORT=80

# Code Execution Engine (Optional self-hosted Judge0)
JUDGE0_URL=http://judge0-server:2358
```

> [!CAUTION]
> Never commit `.env` or production passwords to version control. Generate a cryptographically secure 512-bit JWT secret using:
> ```bash
> openssl rand -hex 64
> ```

---

## 🚀 3. Quick Start Deployment

To build and start the core stack (PostgreSQL, Spring Boot Backend, and Nginx Frontend):

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

To run with the **full self-hosted Judge0 sandbox execution stack** included:

```bash
docker compose -f docker-compose.prod.yml --profile full up -d --build
```

### Checking Container Health:
```bash
docker compose -f docker-compose.prod.yml ps
```

All containers will report `(healthy)` when ready.

---

## 🔒 4. Production Security Hardening Implemented

### 1. API Rate Limiting (`RateLimitingFilter.java`)
- **Authentication Endpoints** (`/api/v1/auth/login`): Maximum 15 requests per minute per IP to defend against brute-force attacks.
- **Code Execution Endpoints** (`/api/v1/submissions/run`, `/api/v1/submissions/submit`): Maximum 30 executions per minute per client IP to prevent compute resource starvation.
- **General Endpoints**: 120 requests per minute.
- Returns HTTP `429 Too Many Requests` with `Retry-After: 60` and standard JSON error payload.

### 2. HTTP Security Headers
The Nginx web proxy and Spring Security filter assert the following defense headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (prevents clickjacking attacks)
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 3. Non-Root Container Execution
The backend runs under an unprivileged user (`spring:spring`, UID `10001`) preventing container escape privilege escalation.

### 4. Read-Only Student Impersonation Guard
Admins can inspect student profiles and dashboards in read-only mode without risk of unintended mutations or grade tampering.

---

## 🛡️ 5. Automated SSL/TLS Configuration (Reverse Proxy)

For live domain deployment (e.g. `learn.recursivecoders.com`), place Caddy or Certbot Nginx in front of port 80:

### Option A: Using Caddy (Recommended - Automatic Let's Encrypt SSL)
Create `Caddyfile`:
```caddy
learn.recursivecoders.com {
    reverse_proxy localhost:80
}
```
Run:
```bash
caddy run --config Caddyfile
```

---

## 💾 6. Database Automated Backup & Maintenance

### Daily PostgreSQL Backup Cron:
Add to crontab (`crontab -e`):
```bash
0 2 * * * docker exec -t recursive-coders-postgres pg_dump -U recursive_admin placement_platform | gzip > /backups/placement_db_$(date +\%F).sql.gz
```

### Database Restore Command:
```bash
gunzip < /backups/placement_db_2026-10-20.sql.gz | docker exec -i recursive-coders-postgres psql -U recursive_admin -d placement_platform
```

---

## 🩺 7. System Health & Telemetry

- **API Health Check**: `http://<SERVER_IP>/api/v1/health`
- **Actuator Health & Component Status**: `http://<SERVER_IP>/actuator/health`
- **Platform Analytics Overview**: `http://<SERVER_IP>/api/v1/analytics/overview`
- **Weak Topics Radar**: `http://<SERVER_IP>/api/v1/analytics/weak-topics`
