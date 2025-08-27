# LearnHub API

Backend API untuk ## API Documentation

All routes are prefixed with `/api`

### Auth Routes

#### Sign Up
```http 
POST /auth/signup
```
Body:
```json
{
  "email": "user@example.com",
  "full_name": "User Name", 
  "password": "password123",
  "channel_year": 2025
}
```

> Note: New users will have role "INTERN" and status "PENDING" Platform pembelajaran untuk intern.

## Teknologi yang Digunakan

- NestJS - Framework backend
- TypeScript - Bahasa pemrograman 
- Supabase - Database dan Authentication
- JWT - Token based authentication

## Fitur

### Authentication & Authorization
- Sign Up sebagai Intern
- Sign In dengan email/password
- Role based access (ADMIN, MENTOR, INTERN)
- JWT token authentication
- Approval flow untuk user baru

### User Management  
- Update user status (PENDING, APPROVED, REJECTED)
- Search dan filter users
- Channel based management (2025/2026)

### Task Management
- Create task dengan deadline
- Submit task submission
- Review submission status
- Track progress intern

### Resource Sharing
- Upload berbagai tipe resource (Document, Video, Code)
- Kategori resource
- Filter berdasarkan channel

## API Documentation

### Auth Endpoints

#### Sign Up
```http 
POST /auth/signup
```
Body:
```json
{
  "email": "user@example.com",
  "full_name": "User Name", 
  "password": "password123",
  "channel_year": 2025
}
```

> Note: User baru akan memiliki role "INTERN" dan status "PENDING"

#### Sign In
```http
POST /auth/signin
```
Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
```
> Requires JWT token in Authorization header

### User Routes

#### Update User Status (Admin only)
```http
PATCH /users/:id/status
```
Body:
```json
{
  "status": "APPROVED", // PENDING, APPROVED, REJECTED
  "role": "INTERN" // ADMIN, MENTOR, INTERN
}
```

#### List Users (Admin only)
```http
GET /users
```
Query Parameters:
```
search - Search by name/email
role - Filter by role (ADMIN, MENTOR, INTERN)  
status - Filter by status (PENDING, APPROVED, REJECTED)
channel_year - Filter by channel year
page - Page number (default: 1)
limit - Items per page (default: 10)
```

#### Delete Rejected User (Admin only)
```http
DELETE /users/:id
```

### Task Routes

#### Create Task (Admin/Mentor only)
```http
POST /tasks
```
Body:
```json
{
  "title": "Task Title",
  "description": "Task Description", 
  "deadline": "2025-12-31T23:59:59Z",
  "channel_year": 2025
}
```

#### Submit Task (Intern only)
```http
POST /tasks/:taskId/submit
```
Body:
```json
{
  "submission_content": "Task submission content/URL"
}
```

#### Update Task Status (Admin/Mentor only)
```http
PUT /tasks/:taskId/users/:userId/status
```
Body:
```json
{
  "status": "IN_PROGRESS", // OPEN, IN_PROGRESS, COMPLETED
  "submission_status": "IN_REVIEW" // SUBMITTED, IN_REVIEW, NEEDS_REVISION, APPROVED
}
```

#### Get Tasks By Year
```http
GET /tasks/year/:year
```

#### Get User Tasks
```http
GET /tasks/users/:userId
```

### Resource Routes

#### Create Resource (Admin/Mentor only)
```http
POST /resources
```
Body:
```json
{
  "title": "Resource Title",
  "description": "Resource Description",
  "url": "https://example.com/resource",
  "type": "DOCUMENT", // DOCUMENT, VIDEO, CODE, LINK 
  "channel_year": 2025
}
```

#### Get Resources by Year
```http
GET /resources/year/:year
```

#### Get User Resources
```http
GET /resources/users/:userId
```

### Post Routes

#### Create Post
```http
POST /posts
```
Body:
```json
{
  "title": "Post Title",
  "content": "Post content",
  "channel_year": 2025
}
```

#### List Posts
```http
GET /posts
```
Query Parameters:
```
channel_year - Filter by year
user_id - Filter by user
```

#### Get Post
```http
GET /posts/:id
```

#### Update Post
```http
PATCH /posts/:id
```

#### Delete Post
```http
DELETE /posts/:id
```

#### Like/Unlike Post
```http
POST /posts/:id/likes
```
Response:
```json
{
  "liked": true // or false if unliked
}
```

### Comment Routes

#### Add Post Comment
```http
POST /comments/posts/:postId
```
Body:
```json
{
  "content": "Comment content"
}
```

#### Get Post Comments
```http
GET /comments/posts/:postId
```

#### Add Task Comment
```http
POST /comments/tasks/:taskId
```
Body:
```json
{
  "content": "Comment content"
}
```

#### Get Task Comments
```http
GET /comments/tasks/:taskId
```

## Project Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Update environment variables:
```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
PORT=3000
```

4. Run development server:
```bash
npm run start:dev
```

### Get User Tasks
```http
GET /tasks/users/:userId
```

## Resource Management

### Create Resource
```http
POST /resources
```
Body:
```json
{
  "title": "Resource Title",
  "description": "Resource Description",
  "url": "https://example.com/resource",
  "type": "article", // "video", "document", "link"
  "angkatan": "2025"
}
```

### Get Resources by Year
```http
GET /resources/year/:year
```

### Get User Resources
```http
GET /resources/users/:userId
```

## Comments System

### Comment on Post
```http
POST /comments/posts/:postId
```
Body:
```json
{
  "content": "Comment content"
}
```

### Get Post Comments
```http
GET /comments/posts/:postId
```

### Comment on Task
```http
POST /comments/tasks/:taskId
```
Body:
```json
{
  "content": "Comment content"
}
```

### Get Task Comments
```http
GET /comments/tasks/:taskId
```

## Posts

### Create Post
```http
POST /posts
```
Body:
```json
{
  "title": "Post Title",
  "content": "Post Content"
}
```

### Get All Posts
```http
GET /posts
```

### Get User Posts
```http
GET /posts/users/:userId
```

## Catatan Penggunaan

1. Semua endpoint (kecuali register dan login) memerlukan token JWT di header:
```http
Authorization: Bearer your_jwt_token
```

2. Status Submission:
   - `SUBMITTED`: Saat pertama kali di-submit
   - `OVERDUE`: Otomatis jika melewati deadline
   - `REVISED`: Jika perlu revisi
   - `APPROVED`: Setelah di-review dan disetujui admin

3. Status User:
   - `PENDING`: Saat pertama kali register
   - `APPROVED`: Setelah di-approve admin
   - `REJECTED`: Jika ditolak admin

4. Tipe Resource:
   - `article`
   - `video`
   - `document`
   - `link`

5. Role User:
   - `ADMIN`
   - `USER`

## Testing dengan cURL

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "password123",
    "role": "student",
    "division_id": "division-id",
    "angkatan": 2025
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
