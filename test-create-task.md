# Test Create Task API

## Endpoint
**POST** `http://localhost:3000/api/tasks`

## Headers
```
Authorization: Bearer <your-admin-jwt-token>
Content-Type: application/json
```

## Request Body (Minimal - sesuai frontend form)
```json
{
  "title": "Tugas Contoh",
  "description": "Kerjakan tugas ini dengan baik",
  "deadline": "2025-12-31T23:59:59.000Z"
}
```

## Request Body (Dengan file upload)
Gunakan `multipart/form-data`:
- `title`: "Tugas Contoh"
- `description`: "Kerjakan tugas ini dengan baik"
- `deadline`: "2025-12-31T23:59:59.000Z"
- `file`: [upload file] (optional, max 25MB)

## Request Body (Lengkap dengan optional fields)
```json
{
  "title": "Tugas Contoh",
  "description": "Kerjakan tugas ini dengan baik",
  "deadline": "2025-12-31T23:59:59.000Z",
  "channel_year": 2024,
  "division": "BACKEND"
}
```

## Auto-filled Values
Jika tidak disediakan dalam request:
- `channel_year`: Akan diambil dari user yang login, atau default ke tahun saat ini
- `division`: Akan diambil dari division user yang login

## Expected Response
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "Tugas Contoh",
    "description": "Kerjakan tugas ini dengan baik",
    "deadline": "2025-12-31T23:59:59.000Z",
    "channel_year": 2024,
    "division_id": "uuid",
    "created_by": "admin-uuid",
    "file_urls": ["url"] // jika ada file
  }
}
```

## Curl Example
```bash
curl -X POST "http://localhost:3000/api/tasks" \
  -H "Authorization: Bearer <your-admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tugas Contoh",
    "description": "Kerjakan tugas ini dengan baik",
    "deadline": "2025-12-31T23:59:59.000Z"
  }'
```