# CORS Configuration Guide

## Masalah CORS Telah Diperbaiki ✅

Backend LearnHub API sekarang sudah dikonfigurasi dengan CORS yang lengkap untuk menangani semua jenis request dari frontend.

## Konfigurasi CORS yang Telah Diterapkan

### 1. **Dynamic Origin Handling**
- Development: Mengizinkan semua origin
- Production: Mengizinkan origin yang terdaftar + pattern Vercel
- Mendukung localhost dengan port dinamis

### 2. **HTTP Methods yang Didukung**
```
GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
```

### 3. **Headers yang Diizinkan**
```
Origin, X-Requested-With, Content-Type, Accept, Authorization, 
Cache-Control, X-HTTP-Method-Override, Access-Control-Allow-*
```

### 4. **Preflight Request Support**
- Otomatis menangani OPTIONS requests
- Response 200 untuk preflight
- Headers CORS yang lengkap

## Cara Menggunakan dari Frontend

### 1. **Fetch API (Vanilla JavaScript)**
```javascript
// GET Request
const response = await fetch('https://your-backend-url.vercel.app/api/auth', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  },
  credentials: 'include' // Untuk cookies/credentials
});

// POST Request
const response = await fetch('https://your-backend-url.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

### 2. **Axios (React/Next.js)**
```javascript
import axios from 'axios';

// Konfigurasi axios instance
const api = axios.create({
  baseURL: 'https://your-backend-url.vercel.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// GET Request
const response = await api.get('/api/auth');

// POST Request
const response = await api.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// PATCH Request
const response = await api.patch('/api/users/123', {
  name: 'Updated Name'
});
```

### 3. **Next.js API Routes (Proxy Pattern)**
```javascript
// pages/api/proxy/[...path].js
export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  try {
    const response = await fetch(`https://your-backend-url.vercel.app/${apiPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error' });
  }
}
```

## Endpoints yang Tersedia

### 1. **Root Endpoints**
- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/stats` - API statistics

### 2. **Authentication Endpoints**
- `GET /api/auth` - Auth endpoints info
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user (requires auth)

## Testing CORS

### 1. **Browser Developer Tools**
```javascript
// Test di browser console
fetch('https://your-backend-url.vercel.app/api/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 2. **cURL Command**
```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://your-backend-url.vercel.app/api/auth/login

# Test actual request
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"test@example.com","password":"password123"}' \
  https://your-backend-url.vercel.app/api/auth/login
```

## Troubleshooting

### Jika Masih Ada Error CORS:

1. **Pastikan URL Backend Benar**
   - Cek apakah URL backend sudah benar
   - Pastikan tidak ada typo di URL

2. **Cek Headers Request**
   - Pastikan Content-Type: application/json
   - Jangan lupa Authorization header jika diperlukan

3. **Credentials Setting**
   - Gunakan `credentials: 'include'` untuk fetch
   - Gunakan `withCredentials: true` untuk axios

4. **Browser Cache**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)

### Error yang Mungkin Muncul:

1. **"Access to fetch at ... has been blocked by CORS policy"**
   - Solusi: Sudah diperbaiki dengan konfigurasi CORS yang baru

2. **"Preflight request doesn't pass access control check"**
   - Solusi: Sudah ditangani dengan OPTIONS handlers

3. **"Request header field authorization is not allowed"**
   - Solusi: Header Authorization sudah ditambahkan ke allowedHeaders

## Fitur CORS yang Telah Diimplementasi

✅ **Multi-layer CORS Protection**
- NestJS built-in CORS
- Custom CORS middleware
- Controller-level OPTIONS handlers

✅ **Development-friendly**
- Allow all origins di development
- Detailed logging untuk debugging

✅ **Production-ready**
- Whitelist origins untuk production
- Security headers yang lengkap

✅ **Framework Agnostic**
- Bekerja dengan React, Vue, Angular
- Bekerja dengan Next.js, Nuxt.js
- Bekerja dengan vanilla JavaScript

## Kontak

Jika masih ada masalah CORS, silakan hubungi tim backend dengan informasi:
1. URL frontend yang digunakan
2. Method HTTP yang digunakan
3. Headers yang dikirim
4. Error message lengkap dari browser console