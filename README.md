# Sawala Learnhub

Dokumentasi ini menjelaskan struktur proyek, alur data frontend ↔ API, serta file/file penting agar mudah dipahami oleh tim backend.

Ringkasannya:
- Framework: Next.js 15 (App Router) + React 19 + TailwindCSS v4
- API routes: berada di `src/app/api/*` (server-side handler Next.js)
- Penyimpanan sementara: JSON file `src/data/resources.json` dan file upload disimpan ke `public/uploads/`
- Fitur utama yang terhubung dengan backend: Auth proxy dan Resources (list, tambah, detail)

==================================================
1. Struktur Direktori Utama
==================================================

- src/
  - app/
    - layout.tsx: Root layout App Router (global font dan container)
    - globals.css: stylesheet global
    - page.tsx: Home root
    - login/, register/: halaman autentikasi
    - main-Page/
      - layout.tsx: layout khusus mobile container + bottom navigation (untuk section main-Page)
      - page.tsx: dashboard utama (tab Intern / Post)
      - about/
        - page.tsx: halaman About → memuat AboutClient/InternOfYears
        - about-client.tsx: komponen client untuk halaman about (baca query `year`)
        - division-of/
          - page.tsx: wrapper untuk section divisi (menampilkan UiUxSection sebagai contoh)
          - detail-task/: detail tugas (UI lain, non-API)
      - members/: halaman terkait anggota (UI)
      - profile/: (UI profile)
      - resources/
        - add/page.tsx: halaman tambah resources (memuat ResourcesForm)
        - [id]/page.tsx: halaman detail resources; mengambil data dari `/api/resources` dan mencari by id
    - api/
      - resources/route.ts: endpoint GET/POST resources (lihat Bagian 3)
      - _auth/login/route.ts: endpoint GET yang meneruskan request login ke backend (requires NEXT_PUBLIC_API_BASE_URL)
      - auth-proxy/login/route.ts: proxy login GET/POST yang mencoba beberapa path backend umum (lebih robust)
  - components/
    - atoms/, molecules/, organisms/, templates/, pages/, ui/: komponen UI modular
      - molecules/upload/
        - upload-dropzone.tsx: komponen drag&drop/file picker (client-only)
        - file-item.tsx: tampilan file yang diupload
      - molecules/cards/resources/
        - resource-card/resource-card.tsx: tampilan kartu Resources
        - resource-header/resources-header.tsx: filter/sort header (client-only)
      - organisms/resources/resources/
        - resources.tsx: daftar Resources (client component) → fetch `/api/resources` dan render ResourceCard
      - pages/add-resources/resource-form/
        - resources-form.tsx: form tambah resources → POST multipart ke `/api/resources`
        - index.ts: re-export
      - pages/add-resources/add-resource-page/
        - add-resources-page.tsx: halaman wrapper untuk form tambah resources
    - organisms/intern-of-(years)/, intern-section/, post/, task-detail/: UI lain (non-API)
  - data/
    - resources.json: “database” sederhana (array JSON) untuk menyimpan Resources (sementara, untuk pengembangan)
  - services/
    - api.ts: helper fetch (contoh: login via proxy `/api/auth-proxy/login`, getUsers dummy)

- public/
  - assets/icons, images, logos: aset statis
  - uploads/: folder hasil upload file dari `/api/resources` (dibuat otomatis)

- backend/: folder kosong (disiapkan jika backend monorepo kelak)
- tests/: folder test (placeholder)

==================================================
2. Alur Fitur “Resources”
==================================================

- List Resources
  - Komponen: `src/components/organisms/resources/resources/resources.tsx`
  - Perilaku: client component, `useEffect` fetch ke `GET /api/resources`, render `ResourceCard` per item
  - Penempatan UI: digunakan pada tab “Resources” di halaman divisi (mis. `UiUxSection`, `fe-division`, `be-division`)

- Tambah Resources
  - Halaman: `/main-Page/resources/add` → `src/app/main-Page/resources/add/page.tsx`
  - Komponen Form: `src/components/pages/add-resources/resource-form/resources-form.tsx`
  - Validasi: Title, Description, dan File wajib
  - Submit: kirim multipart FormData (title, description, file) ke `POST /api/resources`
  - Navigasi: sukses → `router.back()` agar kembali ke list

- Detail Resources
  - Halaman: `/main-Page/resources/[id]` → `src/app/main-Page/resources/[id]/page.tsx`
  - Perilaku: fetch `GET /api/resources`, cari item by id, tampilkan detail. Jika tipe `file`, tampilkan tombol download; jika link/text disesuaikan field yang tersedia.

- Penyimpanan Data (sementara)
  - Metadata resources disimpan di `src/data/resources.json`
  - File upload disimpan ke `public/uploads/` dengan nama unik
  - Format record:
    ```json
    {
      "id": "uuid",
      "title": "string",
      "author": "Anonymous",   // default, dapat diintegrasikan ke user
      "role": "",
      "description": "string",
      "date": "12 Oct 2025",
      "likes": 0,
      "type": "file" | "text" | "link",
      "fileName": "string|null",
      "fileUrl": "/uploads/xxx.ext|null",
      "createdAt": 1730000000000
    }
    ```

==================================================
3. API Routes (Server) – Next.js App Router
==================================================

- Resources API: `src/app/api/resources/route.ts`
  - GET /api/resources
    - Response: `200 OK` array of resources (newest first)
    - Error: `500` JSON `{ message }`
  - POST /api/resources
    - Request: `multipart/form-data`
      - fields: `title` (string), `description` (string), `file` (File, optional oleh handler namun divalidasi wajib di form)
    - Behavior: simpan file (jika ada) ke `public/uploads/`, catat metadata ke `src/data/resources.json`
    - Response: `201 Created` objek resource baru
    - Error: `400` untuk input tidak valid, `500` untuk kegagalan tulis/parse
  - Catatan: Menggunakan filesystem lokal, cocok untuk dev. Untuk produksi, ganti ke DB & object storage.

- Auth Proxy API
  - GET /api/_auth/login
    - File: `src/app/api/_auth/login/route.ts`
    - Mengirim POST ke `${NEXT_PUBLIC_API_BASE_URL}/api/auth/login`
    - Menangani timeout 15s, pass-through response JSON
  - GET/POST /api/auth-proxy/login
    - File: `src/app/api/auth-proxy/login/route.ts`
    - Lebih robust: mencoba beberapa varian endpoint (POST/GET, path `/api/auth/login`, `/auth/login`, `/api/v1/auth/login`, `/v1/auth/login`)
    - Timeout per-attempt 10s, deadline global 25s
    - Memerlukan `NEXT_PUBLIC_API_BASE_URL`

==================================================
4. Variabel Lingkungan
==================================================

- `NEXT_PUBLIC_API_BASE_URL`: Base URL backend otentikasi (digunakan oleh `/api/_auth/login` dan `/api/auth-proxy/login`). Contoh: `https://api.example.com`
- Catatan: Resources API saat ini tidak perlu env karena menyimpan ke filesystem lokal.

==================================================
5. Menjalankan Proyek
==================================================

- Development
  - `npm install`
  - `npm run dev`
  - Buka `http://localhost:3000`

- Build & Start
  - `npm run build`
  - `npm start`

- Lint
  - `npm run lint`

==================================================
6. Catatan Untuk Tim Backend (Integrasi ke DB)
==================================================

- Resources
  - Gantikan penyimpanan JSON (`src/data/resources.json`) dengan database (mis. PostgreSQL + Prisma/Drizzle).
  - Endpoint `POST /api/resources`:
    - Simpan metadata ke DB; untuk file, gunakan object storage (S3, GCS, Supabase Storage) dan simpan URL public di DB.
    - Pertimbangkan validasi tipe file, ukuran file, dan antivirus scan jika diperlukan.
  - Endpoint `GET /api/resources`:
    - Ambil dari DB, sorting by createdAt desc.
  - Detail by id (opsional): dapat menambahkan route `GET /api/resources/[id]` untuk pengambilan langsung satu item, sehingga halaman detail tidak perlu mem-fetch seluruh list.

- Auth
  - `auth-proxy` saat ini mem-forward ke BE menggunakan `NEXT_PUBLIC_API_BASE_URL`. Sesuaikan path final endpoint backend Anda agar salah satu varian berhasil.
  - Pertimbangkan menambahkan session/token management di API route (set-cookie, refresh token) jika dibutuhkan oleh UX selanjutnya.

==================================================
7. Lokasi UI Terkait Resources
==================================================

- Daftar (list) Resources: komponen `Resources` digunakan di halaman divisi berikut:
  - `src/components/pages/division/ui-ux/ui-ux.tsx`
  - `src/components/pages/division/frontend/fe-division.tsx`
  - `src/components/pages/division/backend/be-division.tsx`
- Tambah Resources: `/main-Page/resources/add`
- Detail Resources: `/main-Page/resources/[id]`

==================================================
8. Dependensi Utama
==================================================

- next 15, react 19, lucide-react (ikon), tailwindcss v4
- Radix UI (beberapa komponen)

==================================================
9. Testing
==================================================

- Folder `tests/` disiapkan (contoh: `tests/components/molecules/inputs/input-post/input-post.test.tsx`).
- Silakan menambahkan konfigurasi testing (Jest/RTL/Vitest) sesuai kebutuhan.

==================================================
10. Konvensi & Catatan Tambahan
==================================================

- Sebagian besar komponen UI bertipe client component (menggunakan hook React) — diberi pragma "use client" saat diperlukan.
- Untuk produksi, hindari penyimpanan filesystem di serverless. Direkomendasikan mengganti ke layanan storage dan DB yang persisten.
- Struktur komponen mengikuti atoms → molecules → organisms → pages untuk memudahkan reuse dan pemeliharaan.
