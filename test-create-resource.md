# Test Create Resource API

## Endpoint
**POST** `http://localhost:3001/api/resources`

## Authentication
Requires JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Request Examples

### 1. Minimal Request (Matching Frontend Form)
```json
{
  "title": "Tutorial Figma",
  "description": "Video pembelajaran penggunaan Figma untuk desain UI/UX",
  "url": "https://www.youtube.com/watch?v=xxxxxxx",
  "type": "VIDEO"
}
```

### 2. With File Upload (Form Data)
```bash
curl -X POST "http://localhost:3001/api/resources" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "title=Tutorial React Hooks" \
  -F "description=Panduan lengkap React Hooks untuk pemula" \
  -F "url=https://example.com/react-hooks" \
  -F "type=DOCUMENT" \
  -F "file=@/path/to/your/file.pdf"
```

### 3. Complete Request with All Fields
```json
{
  "title": "Panduan Git & GitHub",
  "description": "Tutorial lengkap penggunaan Git dan GitHub untuk kolaborasi",
  "url": "https://github.com/example/git-tutorial",
  "type": "LINK",
  "angkatan": 2025,
  "division_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Auto-Fill Behavior

### Division ID
- **If not provided**: Automatically uses current user's division
- **If provided**: Uses the specified division (UUID or division name)

### Angkatan/Channel Year
- **If not provided**: Uses current user's year or current year
- **If provided**: Uses the specified year

## Resource Types
Available types:
- `VIDEO` - Video tutorials
- `DOCUMENT` - PDF, Word docs, etc.
- `LINK` - External links
- `IMAGE` - Images, diagrams
- `AUDIO` - Audio files, podcasts

## Testing with Postman

1. **Set Method**: POST
2. **Set URL**: `http://localhost:3001/api/resources`
3. **Add Headers**:
   ```
   Authorization: Bearer <your-jwt-token>
   Content-Type: application/json
   ```
4. **Set Body** (raw JSON):
   ```json
   {
     "title": "Test Resource",
     "description": "This is a test resource",
     "url": "https://example.com/test",
     "type": "LINK"
   }
   ```

## Expected Response

### Success (201 Created)
```json
{
  "id": "uuid-here",
  "title": "Tutorial Figma",
  "description": "Video pembelajaran penggunaan Figma untuk desain UI/UX",
  "url": "https://www.youtube.com/watch?v=xxxxxxx",
  "type": "VIDEO",
  "channel_year": 2025,
  "division_id": "uuid-here",
  "division_name": "Frontend Development",
  "created_by": "John Doe",
  "created_at": "2025-01-02T10:30:00.000Z",
  "updated_at": "2025-01-02T10:30:00.000Z"
}
```

### Error (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "url must be a URL address"
  ],
  "error": "Bad Request"
}
```

## Notes
- The API automatically fills missing `division_id` and `angkatan` based on the authenticated user's profile
- Frontend forms only need to provide: title, description, url, type, and optional file
- The API handles the complexity of resolving user context and defaults