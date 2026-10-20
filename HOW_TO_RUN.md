# 🚀 How to Run & Test the Project

This guide provides step-by-step instructions for running the **Placement Training & Tracking Platform** locally on Windows using PowerShell.

---

## 📋 Prerequisites
- **Java**: JDK 21+ (`java -version`)
- **Node.js**: v20+ (`node -v`)
- **pnpm**: v10+ (`pnpm -v`)
- **Docker Desktop** *(Optional — only needed for Option B)*

---

## ⚡ Option A: Instant Zero-Setup (Recommended — No Docker Required)

Runs the Spring Boot API with an in-memory database and auto-seeded Administrator account.

### 1. Terminal 1 — Start Backend API (Port 8080)
Open a PowerShell terminal at the project root (`c:\Reccursive Coders`):
```powershell
cd "apps\api"
$env:SPRING_PROFILES_ACTIVE="test"; .\mvnw.cmd spring-boot:run
```
> Wait until you see:
> ```text
> Tomcat started on port 8080 (http) with context path '/'
> Initial administrator account seeded successfully.
> Started PlacementApplication in ... seconds
> ```

---

### 2. Terminal 2 — Start Web Application (Port 5173)
Open a second PowerShell terminal at the project root (`c:\Reccursive Coders`):
```powershell
pnpm --filter @placement/web run dev
```
> Wait until you see:
> ```text
> VITE v6.x.x ready in ... ms
> ➜ Local: http://localhost:5173/
> ```

---

## 🐳 Option B: Full Production Setup (With Docker PostgreSQL)

If you have Docker Desktop installed and running:

### 1. Terminal 1 — Start PostgreSQL & Backend API
```powershell
# Step 1: Start PostgreSQL container
cd "infra"
docker compose up -d postgres

# Step 2: Start Spring Boot with Flyway migrations against Postgres
cd "..\apps\api"
.\mvnw.cmd spring-boot:run
```
*(Optional: to start the self-hosted Judge0 sandbox as well, run `docker compose --profile full up -d` in `infra/`)*

### 2. Terminal 2 — Start Web Application
```powershell
cd "c:\Reccursive Coders"
pnpm --filter @placement/web run dev
```

---

## 🌐 Application Access & Endpoints

| Resource | URL | Description |
| :--- | :--- | :--- |
| **Web Application** | [http://localhost:5173](http://localhost:5173) | Main React Web Client |
| **Login Portal** | [http://localhost:5173/login](http://localhost:5173/login) | Sign-in page for all roles |
| **Swagger UI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive OpenAPI 3.0 API explorer & tester |
| **OpenAPI Docs** | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) | Raw OpenAPI JSON specification |
| **Health Check** | [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health) | API service health status (`{"status":"UP"}`) |

---

## 🔑 Default Login Credentials

| Role | Email | Password | Features to Explore |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@company.com` | `AdminPassword123!` | User Directory, Batch Setup, Assign Trainers, Global Leaderboards |
| **Trainer** | *Created by Admin* | `Welcome@2026!` *(Change on 1st login)* | Batch Manager, Question Builder (Markdown + Test Cases), Cohort Leaderboards |
| **Student** | *Created by Admin or CSV* | `Welcome@2026!` *(Change on 1st login)* | Monaco Coding Workspace, Daily Streaks 🔥, 365-day Activity Heatmap, Leaderboards |

---

## 🧪 Running Automated Tests

### Backend Unit & Integration Tests (27 tests)
```powershell
cd "apps\api"
.\mvnw.cmd test
```

### Frontend Type-Checking & Production Build Check
```powershell
pnpm --filter @placement/web run build
```

---

## 💡 Troubleshooting Tips

1. **PowerShell separator error**:
   - In standard PowerShell 5.1, `&&` is not supported. Use `;` instead of `&&` when chaining commands.
2. **Port 8080 or 5173 already in use**:
   - Check if another process is running:
     ```powershell
     netstat -ano | findstr :8080
     ```
   - Stop the existing process:
     ```powershell
     Stop-Process -Id <PID> -Force
     ```
3. **TypeScript API Client Drift**:
   - If you modify backend DTOs or endpoints, regenerate the typed Axios client with:
     ```powershell
     pnpm --filter @placement/web run generate-api
     ```
