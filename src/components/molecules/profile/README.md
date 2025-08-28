# Profile Components

Komponen-komponen untuk menampilkan halaman profile user yang dapat digunakan kembali.

## Komponen yang Tersedia

### 1. ProfileHeader
Komponen header yang menampilkan foto profil, nama, role, dan institusi user.

**Props:**
- `username`: string - Nama user
- `role`: string - Role/jabatan user
- `institution`: string - Institusi tempat user bekerja/belajar
- `profileImage?`: string - URL gambar profil (opsional)
- `onEditProfile?`: function - Callback saat tombol edit profile ditekan

**Contoh Penggunaan:**
```tsx
<ProfileHeader
  username="Bimo"
  role="Full Stack"
  institution="SMKN 1 Sumedang"
  profileImage="/assets/images/profile.png"
  onEditProfile={() => console.log("Edit profile")}
/>
```

### 2. ProfileMenuItem
Komponen item menu yang dapat digunakan untuk navigasi atau action.

**Props:**
- `icon`: ReactNode - Icon untuk menu item
- `label`: string - Label menu item
- `href?`: string - URL untuk navigasi (opsional)
- `onClick?`: function - Callback saat item diklik (opsional)
- `showArrow?`: boolean - Tampilkan arrow atau tidak (default: true)

**Contoh Penggunaan:**
```tsx
<ProfileMenuItem
  icon={<FileText className="w-6 h-6" />}
  label="My Post"
  href="/profile/posts"
/>
```

### 3. ProfileMenuList
Komponen yang menampilkan daftar menu profile lengkap.

**Props:**
- `onLogout?`: function - Callback saat logout ditekan

**Contoh Penggunaan:**
```tsx
<ProfileMenuList onLogout={() => handleLogout()} />
```

### 4. useProfileData Hook
Custom hook untuk mengelola data profile yang dapat dengan mudah diintegrasikan dengan database.

**Return Value:**
- `profileData`: ProfileData - Data profile user
- `isLoading`: boolean - Status loading
- `error`: string | null - Error message jika ada
- `fetchProfileData`: function - Function untuk fetch data profile
- `updateProfileData`: function - Function untuk update data profile
- `setProfileData`: function - Function untuk set data profile

**Contoh Penggunaan:**
```tsx
const { profileData, isLoading, error, updateProfileData } = useProfileData()
```

## Integrasi dengan Database

Untuk mengintegrasikan dengan database, edit file `use-profile-data.ts`:

1. **Fetch Data:**
```tsx
const fetchProfileData = async (userId?: string) => {
  const response = await fetch(`/api/profile/${userId || 'current'}`)
  const data = await response.json()
  setProfileData(data)
}
```

2. **Update Data:**
```tsx
const updateProfileData = async (updates: Partial<ProfileData>) => {
  const response = await fetch(`/api/profile/${profileData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  const updatedData = await response.json()
  setProfileData(prev => ({ ...prev, ...updates }))
}
```

## Struktur Data ProfileData

```tsx
interface ProfileData {
  id: string
  username: string
  role: string
  institution: string
  profileImage?: string
  email?: string
  phone?: string
  bio?: string
  joinDate?: string
}
```

## Styling

Komponen menggunakan Tailwind CSS dengan design system yang konsisten:
- Warna primary: `blue-600`
- Border radius: `rounded-3xl` untuk header
- Spacing: `p-6`, `gap-4`, `mb-6`
- Transitions: `transition-colors` untuk hover effects


