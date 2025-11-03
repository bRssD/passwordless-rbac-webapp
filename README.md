
# 🔐 Passwordless RBAC Web App

Modern web uygulamaları için güvenli, hızlı ve kullanıcı dostu bir kimlik doğrulama sistemi.  
Bu proje, **passwordless MFA (TOTP + QR Code)** tabanlı giriş ve **RBAC (Role-Based Access Control)** yapısını içerir.

> ✅ **Hiç parola yok!**  
> ✅ **Google Authenticator / Microsoft Authenticator** ile giriş  
> ✅ **Admin panel, rol yönetimi, MFA reset, recovery codes**  
> ✅ **Docker destekli tam deploy**

---

## 🚀 Features (Özellikler)

| Özellik | Açıklama |
|---|---|
TOTP-tabanlı passwordless login | ✅ Parola yok, QR ile MFA setup  
JWT Authentication | ✅ Access Token + Role Claims  
RBAC | ✅ Admin / Viewer yetkilendirme  
Admin Panel | ✅ Kullanıcı listeleme, rol değiştirme  
MFA Reset | ✅ Yeni secret + QR + recovery codes  
Recovery Codes | ✅ TOTP bozulursa yedek login  
User Delete | ✅ Admin tarafında silme  
Docker Compose | ✅ API + React + PostgreSQL  
First User = Admin | ✅ Otomatik bootstrap  

---

## 🧠 Tech Stack

| Teknoloji | Açıklama |
|---|---|
**Backend** | .NET 8 Web API  
**Frontend** | React + Vite + TypeScript  
**Auth** | JWT + TOTP (Otp.NET) + QRCode  
**DB** | PostgreSQL  
**ORM** | Entity Framework Core  
**Container** | Docker + Compose  

---

## 📌 System Architecture

```
┌────────────┐       JWT       ┌────────────────┐
│ React UI   │ ─────────────→ │ .NET 8 Web API │
└────────────┘                 └───────┬────────┘
         ▲                            │ EF Core
         │ QR + Codes                 ▼
         └──────────────   PostgreSQL DB
```

---

## 🏁 Neden Passwordless?

✔ Parola yok = Phishing riski yok  
✔ Kullanıcı tarafında ekstra yük yok  
✔ Kurumsal MFA standardı  
✔ Modern IAM yaklaşımı (Okta/Auth0 benzeri)

---

## ▶️ Projeyi Çalıştırma

### **1️⃣ Clone**
```bash
git clone https://github.com/bRssD/passwordless-rbac-webapp.git
cd passwordless-rbac-webapp
```

### **2️⃣ Docker ile Başlat**
```bash
docker compose up --build
```

### 🚀 Uygulama Endpoints

| Uygulama | URL |
|---|---|
Frontend | http://localhost:3000  
API | http://localhost:5000/swagger  

---

## 🔥 Demo Akışı

1️⃣ Email gir → QR code oluşur  
2️⃣ QR’ı Authenticator ile tara  
3️⃣ Açılan sayfaya uygulamadaki 6 haneli kodu gir  
4️⃣ Token alınır → Dashboard  
5️⃣ Admin panel → user yönetimi

---

## 🛡 Security Highlights

- TOTP RFC-6238 uyumlu 6-haneli kod
- Her kullanıcıya random Base32 secret
- JWT role claims
- Recovery codes (tek kullanımlık)
- Default admin bootstrap

---

## 👤 Admin Bootstrap

İlk kayıt edilen kullanıcı **otomatik Admin** olur.  
Sonraki kullanıcılar = Viewer

---

## 🧾 Recovery Codes Kullanım

QR bozulur / cihaz değişirse giriş ekranına yaz → login olur → kod silinir.

1 kod = 1 giriş ✅

---

## 📸 Screenshots

> Login → QR → MFA → Dashboard → Admin Panel → Reset MFA

_(sunum sırasında ekran görüntüleri eklenecek)_

---

## 🏁 Sonuç

Bu proje ile;

✅ Parola gerektirmeden güvenli MFA giriş  
✅ TOTP ve Recovery Code desteği  
✅ Role-Based Access Control  
✅ Docker ile production-ready yapı

---

## ✨ Geliştirici
**Barış Demirer (bRssD)**  
GitHub: https://github.com/bRssD
