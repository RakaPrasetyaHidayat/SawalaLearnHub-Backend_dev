# Endpoint FIX Available (Local URLs)

## Base
- **Base URL**: `http://localhost:3000`
- **API Prefix**: `/api`
- **Swagger Docs**: `http://localhost:3000/api/docs` (non-production)

> Most endpoints require `Authorization: Bearer <JWT>`.

## App
- **GET**: `http://localhost:3000/` — Root info (no prefix)
- **GET**: `http://localhost:3000/api/ping`
- **GET**: `http://localhost:3000/api/health`
- **GET**: `http://localhost:3000/api/stats`

## Authentication
- **GET**: `http://localhost:3000/api/auth/ping`
- **POST**: `http://localhost:3000/api/auth/register`
- **POST**: `http://localhost:3000/api/auth/login`
- **GET**: `http://localhost:3000/api/auth/me` (JWT)
- **GET**: `http://localhost:3000/api/auth/check`
- **GET**: `http://localhost:3000/api/auth/db-check`

## Users
- **GET**: `http://localhost:3000/api/users/division/{divisionId}` (JWT + Admin)
- **GET**: `http://localhost:3000/api/users/info`
- **GET**: `http://localhost:3000/api/users/all` (JWT + Admin)
- **GET**: `http://localhost:3000/api/users/ping`
- **GET**: `http://localhost:3000/api/users/quick`
- **GET**: `http://localhost:3000/api/users/test-db`
- **GET**: `http://localhost:3000/api/users` (JWT + Admin; query: `page`, `limit`, `search`, `status`, `role`)
- **PATCH**: `http://localhost:3000/api/users/{id}/status` (JWT + Admin)
- **DELETE**: `http://localhost:3000/api/users/{id}` (JWT + Admin)
- **GET**: `http://localhost:3000/api/users/pending` (JWT + Admin)

## Posts
- **GET**: `http://localhost:3000/api/posts/info`
- **POST**: `http://localhost:3000/api/posts` (JWT)
- **GET**: `http://localhost:3000/api/posts/list` (JWT; query: `page`, `limit`, `search`)
- **GET**: `http://localhost:3000/api/posts/{id}` (JWT)
- **PATCH**: `http://localhost:3000/api/posts/{id}` (JWT)
- **DELETE**: `http://localhost:3000/api/posts/{id}` (JWT)
- **POST**: `http://localhost:3000/api/posts/{id}/comments` (JWT)
- **GET**: `http://localhost:3000/api/posts/{id}/comments` (JWT)
- **POST**: `http://localhost:3000/api/posts/{id}/likes` (JWT)
- **GET**: `http://localhost:3000/api/posts/user/{userId}` (JWT)

## Comments
- **GET**: `http://localhost:3000/api/comments/info`
- **POST**: `http://localhost:3000/api/comments/posts/{postId}` (JWT)
- **GET**: `http://localhost:3000/api/comments/posts/{postId}` (JWT)
- **POST**: `http://localhost:3000/api/comments/tasks/{taskId}` (JWT)
- **GET**: `http://localhost:3000/api/comments/tasks/{taskId}` (JWT)

## Resources
- **GET**: `http://localhost:3000/api/resources/info`
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

- **GET**: `http://localhost:3000/api/resources` (JWT)
  - Description: Get all resources with optional filters
  - Auth: JWT required
  - Query Parameters:
    - `year`: Filter by academic year (optional)
    - `search`: Search in title/description (optional)
    - `limit`: Number of items per page (optional)
    - `page`: Page number for pagination (optional)

- **POST**: `http://localhost:3000/api/resources` (JWT)
  - Description: Create a new learning resource
  - Auth: JWT required
  - Request Body:
    ```json
    {
      "title": "string",
      "description": "string",
      "url": "string",
      "type": "string",
      "angkatan": "string"
    }
    ```

- **GET**: `http://localhost:3000/api/resources/year/{year}` (JWT)
  - Description: Get resources filtered by academic year
  - Auth: JWT required
  - Parameters:
    - `year`: Academic year (e.g., "2023")
  - Response: List of resources for the specified year with creator info

- **GET**: `http://localhost:3000/api/resources/users/{userId}` (JWT)
  - Description: Get resources created by a specific user
  - Auth: JWT required
  - Parameters:
    - `userId`: ID of the user
  - Response: List of resources created by the user

## Tasks
- **GET**: `http://localhost:3000/api/tasks/info`
- **POST**: `http://localhost:3000/api/tasks` (JWT)
- **POST**: `http://localhost:3000/api/tasks/{taskId}/submit` (JWT)
- **PUT**: `http://localhost:3000/api/tasks/{taskId}/users/{userId}/status` (JWT + Admin)
- **GET**: `http://localhost:3000/api/tasks/year/{year}` (JWT)
- **GET**: `http://localhost:3000/api/tasks/users/{userId}` (JWT)

## Divisions
- **GET**: `http://localhost:3000/api/divisions` (JWT)
- **GET**: `http://localhost:3000/api/divisions/{id}` (JWT)
- **POST**: `http://localhost:3000/api/divisions` (JWT + Admin)
- **PATCH**: `http://localhost:3000/api/divisions/{id}` (JWT + Admin)
- **DELETE**: `http://localhost:3000/api/divisions/{id}` (JWT + Admin)

---
- If your server runs on a different port, replace `3000` accordingly.
- Ensure to include `Authorization: Bearer <token>` for protected routes.