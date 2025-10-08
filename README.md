# Passwordless RBAC Web App
A small reference application built during a 1-month internship to learn end-to-end delivery: **design → build → test → containerize → publish**.  
The app demonstrates **passwordless sign-in via Authenticator (TOTP)** and a **minimal RBAC** model (`admin` / `viewer`).

> Owner: Can Çopur  
> Intern: **Barış Demirer (bRssD)** — <bardemirer1903@hotmail.com>

## ✨ Goals
- **Passwordless authentication** using a 6-digit rotating Authenticator code (RFC 6238 TOTP)
- **Role-based access control (RBAC)** with two roles: `admin` and `viewer`
- **Admin UI** for basic user management (create, activate/deactivate, reset authenticator, issue recovery codes)
- **Profile page** for the signed-in user
- **Dockerized stack**: API, UI, PostgreSQL via Docker Compose; images pushed to Docker Hub

_Not included in MVP:_ SSO/IdP, WebAuthn/Passkeys, SMS/phone, complex permission matrices, refresh tokens.

## 🧱 Architecture
api/ → ASP.NET Core (.NET 8) REST API  
ui/ → React + TypeScript SPA  
infra/ → Docker Compose & deployment docs  
DB → PostgreSQL  
Auth → TOTP (Authenticator), recovery codes  
Tokens → Short-lived access tokens (in-memory on client in MVP)

## 🛠 Tech Stack
- **Backend:** ASP.NET Core (.NET 8), EF Core, Npgsql, OtpNet, QRCoder  
- **Frontend:** React 18, TypeScript, React Router  
- **Database:** PostgreSQL 16  
- **Container:** Docker, Docker Compose  
- **VCS:** Git + GitHub (@bRssD)

## 🚀 Quick Start (Local Development)

### Prerequisites
- .NET 8 SDK  
- Node.js (LTS) & npm  
- Docker Desktop (with WSL2 on Windows)  
- Git

Check:
```bash
dotnet --version
node -v
npm -v
docker --version
git --version
```

### 1) Clone
```bash
git clone https://github.com/bRssD/passwordless-rbac-webapp.git
cd passwordless-rbac-webapp
```

### 2) Run API locally
```bash
cd api/PasswordlessRbacApi
$Env:ASPNETCORE_URLS="http://localhost:5000"
dotnet run
```
Test: http://localhost:5000/health → should return "OK"

### 3) Run UI locally
```bash
cd ui/passwordless-ui
npm start
```
UI runs at: http://localhost:3000

## 🐳 Run Everything via Docker Compose
```bash
cd infra
docker compose up --build
```
Services:  
- API → http://localhost:5000  
- UI → http://localhost:3000  
- DB → localhost:5432 (user: app / password: app123 / db: passwordlessdb)

## 🔐 Environment Variables
**Backend**
```bash
ASPNETCORE_URLS=http://+:5000
ConnectionStrings__Default=Host=db;Database=passwordlessdb;Username=app;Password=app123
BOOTSTRAP_CODE=change-me-1st-admin
CORS__AllowedOrigin=http://localhost:3000
```
**Frontend**
```bash
REACT_APP_API_BASE=http://localhost:5000
```

## 👤 Passwordless Flow
1. **Bootstrap first admin:** When no users exist → enter `BOOTSTRAP_CODE` → scan QR in Authenticator → confirm with 6-digit code.  
2. **Sign-in:** Enter email → enter 6-digit code → access granted.  
3. **Recovery:** Single-use recovery codes are generated during enrollment/reset; admin can reset user authenticators.

## 🧪 Manual Test Plan
- Bootstrap the first admin  
- Sign in as admin with TOTP  
- Create a viewer and sign in  
- Verify viewer cannot access admin pages  
- Invalid codes should trigger rate-limit/lockout  
- Recovery code must be single-use  

## 🔒 Security Notes
- Generate and encrypt TOTP secrets on the server; never log them  
- Allow ±1 time-step tolerance  
- Rate-limit or lock out repeated failed attempts  
- Restrict CORS to the UI origin  
- Store secrets in environment variables, not in the repo  

## 🗺 1-Month Roadmap
- **Week 1** — Setup  
- **Week 2** — Passwordless Authentication  
- **Week 3** — RBAC & Pages  
- **Week 4** — Polish & Publish  

## 📦 Docker Hub (later)
```bash
docker login

docker build -t bRssD/passwordless-api:0.1.0 -f api/PasswordlessRbacApi/Dockerfile api/PasswordlessRbacApi
docker push bRssD/passwordless-api:0.1.0

docker build -t bRssD/passwordless-ui:0.1.0 -f ui/passwordless-ui/Dockerfile ui/passwordless-ui
docker push bRssD/passwordless-ui:0.1.0
```

## 📫 Contact
Barış Demirer (bRssD) — <bardemirer1903@hotmail.com>  
Can Çopur — (owner/contact)
