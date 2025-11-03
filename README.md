# Passwordless RBAC Web App

A modern, secure, and fast authentication system demonstrating **passwordless login (TOTP + QR Code)** with **RBAC (Role‑Based Access Control)**.

This internship project includes:

✅ **Passwordless login** (TOTP Authenticator)  
✅ **Admin panel** with user management  
✅ **MFA reset, recovery codes, role management**  
✅ **Docker containers (API, UI, PostgreSQL)**  
✅ **.NET + React full‑stack implementation**

---

## 🚀 Features

| Category | Feature |
|--------|--------|
| Authentication | ✅ Passwordless (no password) login |
| MFA | ✅ Google Authenticator QR setup |
| Identity | ✅ JWT token + Role claims |
| Roles | ✅ Admin / Viewer |
| MFA Recovery | ✅ Recovery codes |
| User Actions | ✅ Activate / Deactivate, make admin/viewer, reset MFA |
| Admin Tools | ✅ View users, delete users |
| UI | ✅ Clean Bootstrap UI |
| Infra | ✅ Docker Compose for full stack |

---

## 🧠 Why Passwordless?

- ❌ No password leaks / phishing
- ❌ No password resets needed
- ✅ Higher security
- ✅ User convenience
- ✅ Modern authentication (Google Authenticator style)

---

## 🏗️ System Architecture

```
React UI  →  JWT  → .NET Web API
                    ↓
        PostgreSQL (user + TOTP + Recovery Codes)
```

**Services Included**
- api/ → .NET 8 Web API + EF Core
- ui/ → React + TypeScript
- PostgreSQL DB
- Docker compose orchestration

---

## 🛠 Tech Stack

| Layer | Tech |
|------|------|
Frontend | React (TS), Bootstrap  
Backend | .NET 8, ASP.NET Core Web API, EF Core  
Database | PostgreSQL  
Security | TOTP (Otp.NET), JWT  
DevOps | Docker & Docker Compose  

---

## ▶️ How to Run

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/bRssD/passwordless-rbac-webapp.git
cd passwordless-rbac-webapp
```

### 2️⃣ Run with Docker
```bash
docker compose up --build -d
```

### 3️⃣ Open App
| Service | URL |
|--------|------|
Web UI | http://localhost:3000  
API Swagger | http://localhost:5000/swagger  

---

## 📂 Folder Structure

```
/api       → .NET backend
/ui        → React frontend
/docker    → Docker + Postgres
```

---

## 🔐 MFA & Recovery Codes

- QR code shown at first login
- Google Authenticator scans it
- MFA required for login
- If user loses authenticator:
  ✅ Admin can reset MFA  
  ✅ Recovery codes can be used once each

---

## 🧪 Demo Admin Flow

1. Create account
2. Scan QR with Google Authenticator
3. Enter TOTP code to login
4. Admin can:
   - Promote user to Admin
   - Disable user
   - Reset MFA & regenerate recovery codes
   - Delete user

---

## 🧑‍💻 Developer

**Barış Demirer (bRssD)**  
Email: bardemirer1903@hotmail.com  
GitHub: https://github.com/bRssD

---

## 📄 License

MIT License  
Feel free to fork & build on this 🚀
