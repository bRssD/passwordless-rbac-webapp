# Passwordless RBAC Web App

A small reference application built during a 1-month internship to learn end-to-end delivery: **design → build → test → containerize → publish**. The app demonstrates **passwordless sign-in via Authenticator (TOTP)** and a **minimal RBAC** model (admin/viewer).

> Owner: Can Çopur  
> Intern: **Barış Demirer (bRssD)** — <bardemirer1903@hotmail.com>

---

## ✨ Goals
- **Passwordless auth** with a 6-digit rotating Authenticator code (RFC 6238 TOTP)
- **RBAC** with two roles: `admin` and `viewer`
- **Admin UI** for basic user management (create, activate/deactivate, reset authenticator, issue recovery codes)
- **Profile page** for the signed-in user
- **Dockerized stack**: API, UI, PostgreSQL via Docker Compose; images pushed to Docker Hub

Not in MVP: SSO/IdP, WebAuthn/Passkeys, SMS/phone, complex permission matrices, refresh tokens.

---

## 🧱 Architecture
api/  → ASP.NET Core (.NET 8) REST API  
ui/   → React + TypeScript SPA  
infra/→ Docker Compose and deployment docs  
DB    → PostgreSQL  
Auth  → TOTP (Authenticator), recovery codes  
Tokens→ Short-lived access tokens (in-memory on client in MVP)

---

## 🛠 Tech Stack
- **Backend:** ASP.NET Core (.NET 8), EF Core, Npgsql, OtpNet, QRCoder
- **Frontend:** React 18, TypeScript, React Router
- **Database:** PostgreSQL 16
- **Container:** Docker, Docker Compose
- **VCS:** Git + GitHub (@bRssD)

---

## 🚀 Quick Start (Local Dev)
### Prerequisites
- .NET 8 SDK  
- Node.js (LTS) & npm  
- Docker Desktop (with WSL2 on Windows)
- Git

Check:
dotnet --version  
node -v  
npm -v  
docker --version  
git --version  

### 1) Clone
git clone https://github.com/bRssD/passwordless-rbac-webapp.git  
cd passwordless-rbac-webapp  

### 2) Run API locally (dev)
cd api/PasswordlessRbacApi  
$Env:ASPNETCORE_URLS="http://localhost:5000"  
dotnet run  
Test: http://localhost:5000/health → "OK"

### 3) Run UI locally (dev)
cd ui/passwordless-ui  
npm start  
UI: http://localhost:3000

---

## 🐳 Run Everything via Docker Compose
cd infra  
docker compose up --build  

Services:
- API → http://localhost:5000
- UI  → http://localhost:3000
- DB  → localhost:5432 (user: app / password: app123 / db: passwordlessdb)

---

## 🔐 Environment Variables
Backend:
ASPNETCORE_URLS=http://+:5000  
ConnectionStrings__Default=Host=db;Database=passwordlessdb;Username=app;Password=app123  
BOOTSTRAP_CODE=change-me-1st-admin  
CORS__AllowedOrigin=http://localhost:3000  

Frontend:
REACT_APP_API_BASE=http://localhost:5000  

---

## 👤 Passwordless Flow
1. **Bootstrap (first admin):** only when there are no users → enter BOOTSTRAP_CODE → QR gösterilir → Authenticator’da tara → 6 haneli kodla onayla.  
2. **Sign-in:** e-mail gir → 6 haneli kod gir → giriş.  
3. **Recovery:** enrollment/reset sırasında tek kullanımlık kodlar üretilir; admin resetleyebilir.

---

## 🧪 Manual Test Plan
- Bootstrap first admin
- Sign in as admin with TOTP
- Create viewer and sign in
- Viewer admin sayfalarına giremesin
- Yanlış kodlar rate-limit/lockout
- Recovery code 1 kez çalışsın

---

## 🔒 Security Notes
- TOTP secret’ları server-side üret, şifrele, loglama
- ±1 zaman adımı toleransı
- Rate limit / lockout
- CORS sadece UI origin
- Secrets env’de, repo’da değil

---

## 🗺 1-Month Roadmap
Week 1 — Setup  
Week 2 — Passwordless Auth  
Week 3 — RBAC & Pages  
Week 4 — Polish & Publish  

---

## 📦 Docker Hub (later)
docker login  
docker build -t bRssD/passwordless-api:0.1.0 -f api/PasswordlessRbacApi/Dockerfile api/PasswordlessRbacApi  
docker push bRssD/passwordless-api:0.1.0  

docker build -t bRssD/passwordless-ui:0.1.0 -f ui/passwordless-ui/Dockerfile ui/passwordless-ui  
docker push bRssD/passwordless-ui:0.1.0  

---

## 📫 Contact
Barış Demirer (bRssD) — bardemirer1903@hotmail.com  
Can Çopur — (owner/contact)
