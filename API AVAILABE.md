# API AVAILABE

Base URL: https://learnhubbackenddev.vercel.app/api

This document lists available endpoints discovered in the backend code (controllers). Each entry includes method, path, auth requirements, request shape and a sample response.

---

## 1. App / Health

- GET /api/
  - Auth: none
  - Description: Root info about the API (version, basic endpoints)
  - Sample response: { status: 'success', message: 'LearnHub API is running', data: { ... } }

- GET /api/ping
  - Auth: none
  - Description: Lightweight ping endpoint
  - Sample response: { status: 'success', message: 'Pong! API is responsive', data: { timestamp, uptime } }

- GET /api/health
  - Auth: none
  - Description: Service health summary

- GET /api/stats
  - Auth: none
  - Description: Static API stats summary

---

## 2. Auth

- POST /api/auth/register
  - Auth: none
  - Body: { email, password, full_name, division_id?, channel_year?, ... }
  - Description: Register new user

- POST /api/auth/login
  - Auth: none
  - Body: { email, password }
  - Description: Login and obtain access token

- GET /api/auth/me
  - Auth: Bearer JWT required
  - Description: Get current authenticated user info

- GET /api/auth/ping
  - Auth: none
  - Description: Auth service ping

- GET /api/auth/db-check (and /api/auth/check)
  - Auth: none
  - Description: DB connectivity check for auth service

---

## 3. Users

Base path: /api/users

- GET /api/users
  - Auth: Bearer JWT required
  - Query: search filters
  - Description: List users (non-admins only see APPROVED users)

- GET /api/users/all
  - Auth: Bearer JWT required
  - Description: Return all users (admin sees full list; non-admins see only APPROVED)

- GET /api/users/ping
  - Auth: none
  - Description: Quick ping for users service

- GET /api/users/division/:division_id?year=YYYY
  - Auth: Bearer JWT required
  - Description: Get users by division. If `year` provided returns members of that channel_year; if not provided returns grouped counts by channel_year

- GET /api/users/year/:year
  - Auth: Bearer JWT required
  - Description: Get users by year (approved-only for non-admins)

- GET /api/users/year/:year/division_id
  - Auth: Bearer JWT required
  - Description: Distinct division IDs for a year

- PATCH /api/users/:id/status
  - Auth: Bearer JWT required (ADMIN)
  - Body: UpdateUserStatusDto
  - Description: Update user status (approve/reject)

- PATCH /api/users/:id/accept
  - Auth: Bearer JWT required (ADMIN)
  - Body: { role?: 'SISWA'|'ADMIN' }
  - Description: Accept user and optionally set role (default SISWA)

- DELETE /api/users/:id
  - Auth: Bearer JWT required (ADMIN)
  - Description: Delete rejected user

- GET /api/users/pending
  - Auth: Bearer JWT required
  - Description: Get users with pending status (admins only get results)

- PATCH /api/users/me
  - Auth: Bearer JWT required
  - Body: partial profile object
  - Description: Update own profile

### Note about `division_id` parameter

The `division_id` column in the `users` table contains mixed values in this project: some rows store a UUID (foreign key to `divisions`), while older rows store human-friendly division names like `Backend`, `Frontend`, `UI/UX`, or `DevOps` as text. The API accepts either form.

Examples:
- By name: GET /api/users/division/Backend?year=2025
- By UUID: GET /api/users/division/2f8e6c3e-...-abcd?year=2025

This makes it easier for the frontend to call the endpoint even when a UUID is not available.

---

## 4. Tasks

Base path: /api/tasks

- GET /api/tasks/info
  - Auth: none
  - Description: Overview of task-related endpoints

- GET /api/tasks/status-options
  - Auth: Bearer JWT required
  - Description: Return submission status enum values for dropdowns

- POST /api/tasks
  - Auth: Bearer JWT required (ADMIN)
  - Body: CreateTaskDto + optional multipart file
  - Description: Create new task. Accepts file upload `file` and returns created task

- POST /api/tasks/submit
  - Auth: Bearer JWT required
  - Body: SubmitTaskDto (task_id optional) or multipart form-data with `file`
  - Description: Flexible submitter: can auto-select latest eligible task for user's division/year or accept `task_id` or `task_identifier`

- POST /api/tasks/:taskId/submit
  - Auth: Bearer JWT required
  - Body: SubmitTaskDto or multipart form-data with `file`
  - Description: Submit to specific task by id or readable identifier

- PUT /api/tasks/:taskId/users/:userId/status
  - Auth: Bearer JWT required (ADMIN)
  - Body: { status: string, feedback?: string }
  - Description: Admin updates a single submission's status and feedback

- GET /api/tasks/year/:year
  - Auth: Bearer JWT required
  - Description: Get tasks by year

- GET /api/tasks/users/:userId
  - Auth: Bearer JWT required
  - Description: Get tasks for a specific user

- GET /api/tasks/available
  - Auth: Bearer JWT required
  - Description: Get available tasks (frontend-friendly format)

- GET /api/tasks/debug/list
  - Auth: Bearer JWT required
  - Description: Debug endpoint listing task IDs and titles

- GET /api/tasks/submissions/:submissionId
  - Auth: Bearer JWT required
  - Description: Get task submission by submission ID (returns description and file_urls)

- GET /api/tasks/:taskId/submission
  - Auth: Bearer JWT required
  - Description: Get authenticated user's submission for the specified task (returns description + file_urls)

- GET /api/tasks/:taskId/submissions
  - Auth: Bearer JWT required (ADMIN)
  - Description: Admin: list all submissions for a task

- PUT /api/tasks/:taskId/admin/review-all
  - Auth: Bearer JWT required (ADMIN)
  - Body: { new_status: string, update_reason?: string }
  - Description: Admin: batch update selected task submissions (filter by task)

- PUT /api/tasks/admin/review-all/:taskId
  - Auth: Bearer JWT required (ADMIN)
  - Description: Alternate path for review-all

- PUT /api/tasks/admin/review-all
  - Auth: Bearer JWT required (ADMIN)
  - Body: { task_id, new_status }
  - Description: Alternate body-based batch update

- PUT /api/tasks/admin/tasks/:taskId/update-all-status
  - Auth: Bearer JWT required (ADMIN)
  - Body: { new_status: SubmissionStatus, feedback?: string }
  - Description: Update all submissions for a task (simplified admin endpoint)

- GET /api/tasks/:taskId
  - Auth: Bearer JWT required
  - Description: Get task detail by id or readable identifier

---

## 5. Resources

- POST /api/resources
  - Auth: Bearer JWT required
  - Body: CreateResourceDto + optional Authorization header forwarded
  - Description: Create a learning resource (file upload supported via token)

- GET /api/resources
  - Auth: Bearer JWT required
  - Query: division_id, year, search, pagination
  - Description: List resources

- GET /api/resources/year/:year
  - Auth: Bearer JWT required
  - Description: Resources by year

- GET /api/resources/:id
  - Auth: Bearer JWT required
  - Description: Get resource by id

- GET /api/resources/users/:userId
  - Auth: Bearer JWT required
  - Description: Get resources uploaded by a user

---

## 6. Posts

- POST /api/posts
  - Auth: Bearer JWT required
  - Body: CreatePostDto + optional multipart file (10MB)

- GET /api/posts/list
  - Auth: Bearer JWT required
  - Description: List posts with filters

- GET /api/posts/:id
  - Auth: Bearer JWT required
  - Description: Get post detail

- PATCH /api/posts/:id
  - Auth: Bearer JWT required
  - Description: Update post

- DELETE /api/posts/:id
  - Auth: Bearer JWT required
  - Description: Delete post

- POST /api/posts/:id/comments
  - Auth: Bearer JWT required
  - Description: Add a comment to a post

- GET /api/posts/:id/comments
  - Auth: Bearer JWT required
  - Description: Get comments for a post

- POST /api/posts/:id/likes
  - Auth: Bearer JWT required
  - Description: Toggle like for a post

- GET /api/posts/user/:userId
  - Auth: Bearer JWT required
  - Description: Get posts by a user

---

## 7. Interns

- GET /api/interns
  - Auth: Bearer JWT required
  - Description: List interns

- GET /api/interns/angkatan/:angkatan
  - Auth: Bearer JWT required
  - Description: Get interns by angkatan

- GET /api/interns/:id
  - Auth: Bearer JWT required
  - Description: Get intern detail

- POST /api/interns
  - Auth: Bearer JWT required (ADMIN)
  - Description: Create intern

- PATCH /api/interns/:id
  - Auth: Bearer JWT required (ADMIN)
  - Description: Update intern

- DELETE /api/interns/:id
  - Auth: Bearer JWT required (ADMIN)
  - Description: Remove intern

---

## 8. Comments

- POST /api/comments/posts/:postId
  - Auth: Bearer JWT required
  - Description: Create comment on a post

- GET /api/comments/posts/:postId
  - Auth: Bearer JWT required
  - Description: Get comments for a post

- POST /api/comments/tasks/:taskId
  - Auth: Bearer JWT required
  - Description: Create comment on a task

- GET /api/comments/tasks/:taskId
  - Auth: Bearer JWT required
  - Description: Get comments for a task

---

## Notes & Known Behaviors

- Routes protected by `RolesGuard` require `Authorization: Bearer <JWT>` and the user role to be `ADMIN` for admin-only endpoints.
- Submission endpoints return `description` and `file_urls` fields so frontend can display file links and textual submission.
- `POST /api/tasks/:taskId/submit` and `POST /api/tasks/submit` both exist; use the path-based variant for explicit task submission.
- Batch admin endpoints exist under `/api/tasks/admin/*` for convenience.

---

## Deployment note (Vercel)

This repository includes serverless handlers under `api/index.ts` and `src/vercel.ts`. When deploying to Vercel, make sure the project is configured as a Node Serverless project (not a static site). Recommended `vercel.json` (already added) sets the serverless builds for the API handler.

If you see the error "No Output Directory named \"public\" found after the Build completed", it means the Vercel project was configured as a static site. Change your Project Settings > Build & Output to use the Node Serverless configuration or remove the "Output Directory" setting.

Notes:
- Build command: `npm run vercel-build` (or `npm run build`)
- Routes: all requests are forwarded to `/api/index.ts` by `vercel.json`
- Ensure environment variables (SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, etc.) are set in Vercel Project Settings

If you'd like, I can also:
- Add a GitHub Action to run `npm run build` and verify `dist` or `api` before deployment
- Test the `vercel.json` locally with `vercel dev` (requires Vercel CLI and auth)




