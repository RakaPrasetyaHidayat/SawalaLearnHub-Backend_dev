# API Reference (concise)

This file captures the most used endpoints and the expected input/outputs so frontend developers can integrate quickly.

Base path: `/api` (depending on deployment)

## Auth
- POST /auth/login
  - returns JWT token

## Users
- GET /api/users (Admin) - list users (supports query: search, role, status, page, limit)
- GET /api/users/all - paginated list (role-based visibility)
- GET /api/users/division/:division_id - get users for a division (accepts UUID or human-friendly name)
- PATCH /api/users/:id (Admin) - update user profile (full_name, division_id, school_name, channel_year)
- PATCH /api/users/me - update own profile
  - PATCH /api/users/me accepts UI-friendly keys:
    - `name` or `full_name`
    - `division` (human-friendly name) or `division_id` (UUID)
    - `school` or `school_name`
    - `channel_year`
    Example body: `{ "name": "Raka", "division": "Backend", "school": "SMK A", "channel_year": 2025 }`
- PATCH /api/users/:id/accept (Admin) - accept user (set status APPROVED)
- PATCH /api/users/:id/status (Admin) - change user status (REJECTED/APPROVED)

## Tasks
- POST /api/tasks (Admin) - create new task (supports optional file upload)
- POST /api/tasks/submit or POST /api/tasks/:taskId/submit - submit a task (supports file upload)
- PUT /api/tasks/:taskId/users/:userId/status (Admin) - update submission status for a user's task
- PUT /api/tasks/:taskId/task-status (Admin) - update task status (e.g., approve task to prevent further submissions)
- GET /api/tasks/:taskId - get task detail (includes submissions with user data)
- GET /api/tasks/year/:year - get tasks by year

## Posts
- POST /api/posts - create post (optional media upload)
- GET /api/posts/:id - get post by id (returns author summary and metadata)
- GET /api/posts/user/:userId - get posts by user
- POST /api/posts/:id/comments - add comment
- POST /api/posts/:id/likes - toggle like


Notes
- All authenticated endpoints require `Authorization: Bearer <token>` header.
- File uploads are sent as multipart/form-data with field name `file`.
- Dates are ISO strings in responses.

If you want, I can generate a Postman collection or OpenAPI spec based on controllers next.
