# 🚀 Sawala LearnHub — Backend Development

Built with **NestJS**, **TypeScript**, and **Supabase** to power the Sawala LearnHub ecosystem.

---

<p align="center">
<img src="https://img.shields.io/badge/NestJS-Backend-red?style=flat-square&logo=nestjs" />
<img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" />
<img src="https://img.shields.io/badge/Supabase-Postgres-green?style=flat-square&logo=supabase" />
<img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" />
</p>

## 📌 Ringkasan Proyek

Sawala LearnHub Backend adalah layanan server yang menyediakan API untuk aplikasi Sawala LearnHub. Dibangun menggunakan **NestJS** untuk skalabilitas, modularitas, dan maintainability, serta terintegrasi dengan **Supabase** sebagai database, autentikasi, dan file storage.

### ✨ Teknologi Utama

* **NestJS (TypeScript)** — Framework backend modern berbasis arsitektur modular.
* **Supabase** — Database Postgres + Auth + Storage.
* **Vercel Serverless** — Untuk deployment cepat dan efisien.

---

## ⚙️ Requirements

Pastikan Anda telah menginstal:

* Node.js **18+**
* npm (atau pnpm/yarn)
* Akun dan project **Supabase**
* Akses ke:

  * `SUPABASE_URL`
  * `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔐 Environment Variables

Buat file `.env` di root project:

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
JWT_SECRET=<your-jwt-secret>
NODE_ENV=development
```

> ⚠️ Jangan pernah commit file `.env` ke repository publik.

---

## 🛠️ Cara Menjalankan Project

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalan dalam Mode Development

```bash
npm run start:dev
```

### 3. Build untuk Production

```bash
npm run build
```

### 4. Jalankan Build Production

```bash
npm run start:prod
```

---

## 📂 Struktur Project (High-level)

```
src/
│── main.ts          # Entry point NestJS
│── app.module.ts    # Root module
│
├── modules/         # Module fitur (users, posts, etc)
├── common/          # Utility, constants & decorators
├── infra/           # Integrasi eksternal (Supabase client)
└── config/          # Config environment & providers
```

---

## 🧪 Script Penting

* `npm run start:dev` — Jalankan server dengan watch mode
* `npm run format` — Format kode dengan Prettier
* `npm run lint` — Linting & auto fix
* `npm run build` — Compile TypeScript ke folder `dist/`

---
