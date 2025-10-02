# Endpoint FIX Available (Local URLs)

## Base
- **Base URL**: `http://localhost:3001`
- **API Prefix**: `/api`
- **Swagger Docs**: `http://localhost:3001/api/docs` (non-production)

> Most endpoints require `Authorization: Bearer <JWT>`.

## App
- **GET**: `http://localhost:3001/` — Root info (no prefix)
- **GET**: `http://localhost:3001/api/ping`
- **GET**: `http://localhost:3001/api/health`
- **GET**: `http://localhost:3001/api/stats`

## Authentication
- **GET**: `http://localhost:3001/api/auth/ping`
- **POST**: `http://localhost:3001/api/auth/register`
- **POST**: `http://localhost:3001/api/auth/login`
- **GET**: `http://localhost:3001/api/auth/me` (JWT)
- **GET**: `http://localhost:3001/api/auth/check`
- **GET**: `http://localhost:3001/api/auth/db-check`

## Users
- **GET**: `http://localhost:3001/api/users/division/{divisionId}` (JWT + Admin)
- **GET**: `http://localhost:3001/api/users/info`
- **GET**: `http://localhost:3001/api/users/all` (JWT + Admin)
- **GET**: `http://localhost:3001/api/users/ping`
- **GET**: `http://localhost:3001/api/users/quick`
- **GET**: `http://localhost:3001/api/users/test-db`
- **GET**: `http://localhost:3001/api/users` (JWT + Admin; query: `page`, `limit`, `search`, `status`, `role`)
- **PATCH**: `http://localhost:3001/api/users/{id}/status` (JWT + Admin)
- **DELETE**: `http://localhost:3001/api/users/{id}` (JWT + Admin)
- **GET**: `http://localhost:3001/api/users/pending` (JWT + Admin)

## Posts
- **GET**: `http://localhost:3001/api/posts/info`
- **POST**: `http://localhost:3001/api/posts` (JWT)
- **GET**: `http://localhost:3001/api/posts/list` (JWT; query: `page`, `limit`, `search`)
- **GET**: `http://localhost:3001/api/posts/{id}` (JWT)
- **PATCH**: `http://localhost:3001/api/posts/{id}` (JWT)
- **DELETE**: `http://localhost:3001/api/posts/{id}` (JWT)
- **POST**: `http://localhost:3001/api/posts/{id}/comments` (JWT)
- **GET**: `http://localhost:3001/api/posts/{id}/comments` (JWT)
- **POST**: `http://localhost:3001/api/posts/{id}/likes` (JWT)
- **GET**: `http://localhost:3001/api/posts/user/{userId}` (JWT)

## Comments
- **GET**: `http://localhost:3001/api/comments/info`
- **POST**: `http://localhost:3001/api/comments/posts/{postId}` (JWT)
- **GET**: `http://localhost:3001/api/comments/posts/{postId}` (JWT)
- **POST**: `http://localhost:3001/api/comments/tasks/{taskId}` (JWT)
- **GET**: `http://localhost:3001/api/comments/tasks/{taskId}` (JWT)

## Resources
- **GET**: `http://localhost:3001/api/resources/info`
  - Description: Get information about Resources API endpoints
  - Auth: JWT Authentication required
  - Response: API documentation and endpoint descriptions
  - Headers Required:
    ```
    Authorization: Bearer <your-jwt-token>
    ```
  - How to get token:
    1. Login via POST `/api/auth/login` with email & password
    2. Copy the JWT token from login response
    3. Add token to Authorization header

- **GET**: `http://localhost:3001/api/resources` (JWT)
  - Description: Get all resources with optional filters
  - Auth: JWT required
  - Query Parameters:
    - `year`: Filter by academic year (optional)
    - `search`: Search in title/description (optional)
    - `limit`: Number of items per page (optional)
    - `page`: Page number for pagination (optional)

- **POST**: `http://localhost:3001/api/resources` (JWT)
  - Description: Create a new learning resource
  - Auth: JWT required
  - Content-Type: `multipart/form-data` (supports file upload)
  - Request Body:
    ```json
    {
      "title": "string (required)",
      "description": "string (required)",
      "url": "string (required)",
      "type": "string (required - VIDEO, DOCUMENT, LINK, etc.)",
      "angkatan": "number (optional - defaults to current user's year or current year)",
      "division_id": "string (optional - defaults to current user's division)"
    }
    ```
  - File Upload: Optional file can be uploaded with key `file`
  - Example minimal request (matching frontend form):
    ```json
    {
      "title": "Tutorial Figma",
      "description": "Video pembelajaran penggunaan Figma",
      "url": "https://www.youtube.com/watch?v=xxxxxxx",
      "type": "VIDEO"
    }
    ```

- **GET**: `http://localhost:3001/api/resources/year/{year}` (JWT)
  - Description: Get resources filtered by academic year
  - Auth: JWT required
  - Parameters:
    - `year`: Academic year (e.g., "2023")
  - Response: List of resources for the specified year with creator info

- **GET**: `http://localhost:3001/api/resources/users/{userId}` (JWT)
  - Description: Get resources created by a specific user
  - Auth: JWT required
  - Parameters:
    - `userId`: ID of the user
  - Response: List of resources created by the user

- **GET**: `http://localhost:3001/api/resources/{id}` (JWT)
  - Description: Get a single resource by its ID
  - Auth: JWT required
  - Path Parameters:
    - `id`: Resource UUID
  - Response (200):
    ```json
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "type": "VIDEO|DOCUMENT|LINK|...",
      "channel_year": 2025,
      "division_id": "uuid|null",
      "division_name": "string|null",
      "created_by": "string",
      "created_by_id": "uuid",
      "created_at": "ISO timestamp"
    }
    ```
  - 404 if not found

## Changelog (Resources)
1. Added GET `/api/resources/{id}` to fetch a single resource by UUID.
2. Improved GET `/api/resources` to support filters `year`, `division_id`, and `search` with pagination (`page`, `limit`).
3. Hardened server-side Supabase calls using service-role client to avoid PostgREST role errors (e.g., `role "ADMIN" does not exist`).
4. POST `/api/resources` now maps `angkatan` → `channel_year` and can default `division_id`/`channel_year` from user profile or DB defaults.

## Tasks
- **GET**: `http://localhost:3001/api/tasks/info`
- **POST**: `http://localhost:3001/api/tasks` (JWT + Admin)
  - Description: Create a new task
  - Auth: JWT required (Admin role only)
  - Content-Type: `multipart/form-data` (supports file upload)
  - Request Body:
    ```json
    {
      "title": "string (required)",
      "description": "string (required)",
      "deadline": "ISO date string (required)",
      "channel_year": "number (optional - defaults to current user's year or current year)",
      "division": "string (optional - defaults to current user's division)"
    }
    ```
  - File Upload: Optional file can be uploaded with key `file` (max 25MB)
  - Example minimal request (matching frontend form):
    ```json
    {
      "title": "Tugas Contoh",
      "description": "Kerjakan tugas ini dengan baik",
      "deadline": "2025-12-31T23:59:59.000Z"
    }
    ```
- **POST**: `http://localhost:3001/api/tasks/{taskId}/submit` (JWT)
- **PUT**: `http://localhost:3001/api/tasks/{taskId}/users/{userId}/status` (JWT + Admin)

  Description: Update a user's submission status for a task. This endpoint is flexible — `taskId` and `userId` may be provided as UUIDs or as readable identifiers (task title, user email, or user full name). The server resolves identifiers to IDs using the admin (service-role) client and performs the review action.

  Auth: JWT required. Caller must be an Admin (enforced by `@Roles(UserRole.ADMIN)`).

  Path parameters:
  - `taskId`: UUID or task title (if title, must uniquely identify a single task)
  - `userId`: UUID, or user email, or user full_name (if non-UUID, must uniquely identify a single user)

  Request body (JSON):
  ```json
  {
    "status": "APPROVED",    
    "feedback": "string (optional)"
  }
  ```
  - `status` must be one of the `submission_status` enum values configured in the DB (e.g., `SUBMITTED`, `OVERDUE`, `REVISION`, `APPROVED`). Use the server-side `SubmissionStatus` enum.

  Success response (200):
  ```json
  {
    "status": "success",
    "message": "Task submission reviewed successfully",
    "data": { /* RPC result or updated submission */ }
  }
  ```

  Common errors:
  - 401 Unauthorized — missing or invalid JWT.
  - 403 Forbidden — authenticated user is not an Admin.
  - 400 Bad Request — provided task/user identifier is ambiguous (matches multiple records); provide a UUID to disambiguate.
  - 404 Not Found — task or user not found by the provided identifier.

  Examples:
  - UUIDs:
    ```bash
    curl -X PUT "http://localhost:3001/api/tasks/1895ec16-.../users/3f8a.../status" \
      -H "Authorization: Bearer <ADMIN_JWT>" \
      -H "Content-Type: application/json" \
      -d '{"status":"APPROVED","feedback":"Good work"}'
    ```

  - Readable identifiers:
    ```bash
    curl -X PUT "http://localhost:3001/api/tasks/Pembelajaran%20Nest.JS/users/deyum@deyum.com/status" \
      -H "Authorization: Bearer <ADMIN_JWT>" \
      -H "Content-Type: application/json" \
      -d '{"status":"APPROVED"}'
    ```
- **GET**: `http://localhost:3001/api/tasks/year?year={year}` (JWT)
- **GET**: `http://localhost:3001/api/tasks/users/{userId}` (JWT)

## Divisions
- **GET**: `http://localhost:3001/api/divisions` (JWT)
- **GET**: `http://localhost:3001/api/divisions/{id}` (JWT)
- **POST**: `http://localhost:3001/api/divisions` (JWT + Admin)
- **PATCH**: `http://localhost:3001/api/divisions/{id}` (JWT + Admin)
- **DELETE**: `http://localhost:3001/api/divisions/{id}` (JWT + Admin)

---
- If your server runs on a different port, replace `3000` accordingly.
- Ensure to include `Authorization: Bearer <token>` for protected routes./