# InternOfYears Component

Komponen ini menampilkan daftar divisi dengan jumlah member yang diambil secara dinamis dari database berdasarkan tahun tertentu.

## Fitur

- ✅ Mengambil data member dari API `/api/users/division/:divisionId`
- ✅ Menampilkan jumlah member berdasarkan tahun (contoh: `intern-of-sawala-2025`)
- ✅ Loading state dengan skeleton components
- ✅ Error handling dengan retry functionality
- ✅ Responsive design
- ✅ Automatic year detection

## Penggunaan

```tsx
import { InternOfYears } from '@/components/organisms/intern-of-(years)/intern-of-(years)'

// Menggunakan tahun saat ini (otomatis)
<InternOfYears />

// Menggunakan tahun spesifik
<InternOfYears year="intern-of-sawala-2024" />
```

## API Integration

Komponen ini mengintegrasikan dengan backend API:

### Endpoint yang digunakan:
- `GET /api/users/division/:divisionId?year={year}`

### Format response yang diharapkan:
```json
[
  {
    "id": "user1",
    "name": "John Doe",
    "email": "john@example.com",
    "division": "frontend",
    "year": "intern-of-sawala-2025",
    "status": "approved"
  }
]
```

## Struktur File

```
src/
├── components/
│   ├── molecules/
│   │   └── cards/
│   │       └── division-card/
│   │           ├── division.tsx
│   │           └── division-skeleton.tsx
│   └── organisms/
│       └── intern-of-(years)/
│           ├── intern-of-(years).tsx
│           └── README.md
├── hooks/
│   └── useDivisions.ts
├── services/
│   └── division.ts
└── utils/
    └── api-error-handler.ts
```

## Konfigurasi Divisi

Divisi dikonfigurasi dalam `src/services/division.ts`:

```typescript
static async getAllDivisions(): Promise<Omit<Division, 'memberCount'>[]> {
  return [
    {
      id: 'all',
      name: 'All Division',
      logo: '/assets/logos/logo1.png',
      logoAlt: 'All Division Logo'
    },
    // ... divisi lainnya
  ]
}
```

## Error Handling

- Network errors
- HTTP status errors (401, 403, 404, 500, dll.)
- Retry functionality untuk error yang bisa di-retry
- Fallback ke 0 member jika API gagal

## Loading States

- Skeleton loading untuk pengalaman pengguna yang lebih baik
- Loading indicator saat fetch data
- Smooth transitions

## Customization

Anda dapat mengkustomisasi:
- Logo dan nama divisi di `getAllDivisions()`
- Format tahun di `useCurrentInternYear()`
- Styling di komponen individual
- Error messages di `ApiErrorHandler`