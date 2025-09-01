# 📚 LearnHub API - Complete Endpoints Documentation

## 🌐 Base URL
```
Production: https://learnhubbackenddev.vercel.app
Development: http://localhost:3001
```

## 📖 Table of Contents
- [Root Endpoints](#-root-endpoints)
- [API Information](#-api-information-endpoints)
- [Authentication](#-authentication-endpoints)
- [User Management](#-user-management-endpoints)
- [Task Management](#-task-management-endpoints)
- [Posts Management](#-posts-management-endpoints)
- [Resources Management](#-resources-management-endpoints)
- [Comments Management](#-comments-management-endpoints)
- [Documentation](#-documentation-endpoints)
- [Response Format](#-response-format)
- [Authentication](#-authentication)
- [Testing Examples](#-testing-examples)

---

## 🏠 Root Endpoints

### Welcome Message
```http
GET /
```
**Description**: API welcome message and overview  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Welcome to LearnHub API",
  "timestamp": "2025-01-28T10:00:00.000Z",
  "environment": "production",
  "version": "1.0.0",
  "data": {
    "description": "LearnHub Backend API for learning management platform",
    "documentation": "/api/docs",
    "endpoints": {
      "api_info": { "method": "GET", "url": "/api" },
      "health": { "method": "GET", "url": "/api/health" },
      "auth": { "method": "GET", "url": "/api/auth" }
    }
  }
}
```

### Favicon Handlers
```http
GET /favicon.ico
GET /favicon.png
```
**Description**: Favicon handlers  
**Authentication**: None  
**Response**: 204 No Content

---

## 🔧 API Information Endpoints

### API Information
```http
GET /api
```
**Description**: Complete API information and endpoints list  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "LearnHub API is running",
  "timestamp": "2025-01-28T10:00:00.000Z",
  "environment": "production",
  "version": "1.0.0",
  "data": {
    "description": "LearnHub API endpoints",
    "endpoints": {
      "health": { "method": "GET", "url": "/api/health" },
      "stats": { "method": "GET", "url": "/api/stats" },
      "auth": { "method": "GET", "url": "/api/auth" }
    }
  }
}
```

### Health Check
```http
GET /api/health
```
**Description**: Service health status  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Service is healthy",
  "data": {
    "timestamp": "2025-01-28T10:00:00.000Z",
    "uptime": 3600,
    "environment": "production",
    "services": {
      "database": "connected",
      "cache": "connected",
      "storage": "connected"
    }
  }
}
```

### API Statistics
```http
GET /api/stats
```
**Description**: API usage statistics  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "API statistics retrieved successfully",
  "data": {
    "totalUsers": 1000,
    "totalPosts": 5000,
    "totalComments": 15000,
    "activeUsers": 750,
    "lastUpdated": "2025-01-28T10:00:00.000Z"
  }
}
```

### CORS Preflight
```http
OPTIONS /api/*
```
**Description**: CORS preflight handler  
**Authentication**: None  
**Response**: 200 OK with CORS headers

---

## 🔐 Authentication Endpoints

### Auth Information
```http
GET /api/auth
```
**Description**: Authentication endpoints information  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Auth endpoints information",
  "data": {
    "description": "Authentication and authorization endpoints",
    "endpoints": {
      "register": { "method": "POST", "url": "/api/auth/register" },
      "login": { "method": "POST", "url": "/api/auth/login" },
      "forgotPassword": { "method": "POST", "url": "/api/auth/forgot-password" },
      "resetPassword": { "method": "POST", "url": "/api/auth/reset-password" }
    }
  }
}
```

### User Registration
```http
POST /api/auth/register
```
**Description**: Register a new user  
**Authentication**: None  
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "USER",
  "division_id": "div-123",
  "angkatan": 2025,
  "school_name": "University Name"
}
```
**Response**:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "USER",
    "status": "PENDING",
    "created_at": "2025-01-28T10:00:00.000Z"
  }
}
```

### User Login
```http
POST /api/auth/login
```
**Description**: User login with credentials  
**Authentication**: None  
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "USER",
      "status": "APPROVED"
    },
    "access_token": "jwt-token-here"
  }
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
```
**Description**: Request password reset  
**Authentication**: None  
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "status": "success",
  "message": "If your email is registered, you will receive a password reset link."
}
```

### Reset Password
```http
POST /api/auth/reset-password
```
**Description**: Reset password with token  
**Authentication**: None  
**Request Body**:
```json
{
  "token": "reset-token",
  "new_password": "newpassword123"
}
```
**Response**:
```json
{
  "status": "success",
  "message": "Password has been reset successfully."
}
```

### Get Current User
```http
GET /api/auth/me
```
**Description**: Get current authenticated user information  
**Authentication**: JWT Token Required  
**Headers**: `Authorization: Bearer jwt-token-here`  
**Response**:
```json
{
  "status": "success",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "USER",
    "status": "APPROVED",
    "angkatan": 2025
  }
}
```

### Auth CORS Preflight
```http
OPTIONS /api/auth/*
```
**Description**: CORS preflight for auth routes  
**Authentication**: None  
**Response**: 200 OK with CORS headers

---

## 👥 User Management Endpoints

### Users Information
```http
GET /api/users/info
```
**Description**: User management endpoints information  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Users API endpoints information",
  "data": {
    "description": "User management endpoints (Admin only)",
    "endpoints": {
      "listUsers": {
        "method": "GET",
        "url": "/api/users",
        "description": "List all users with filters (Admin only)",
        "auth": "Required (Admin)"
      },
      "pendingUsers": {
        "method": "GET",
        "url": "/api/users/pending",
        "description": "Get users with PENDING status (Admin only)",
        "auth": "Required (Admin)"
      },
      "updateStatus": {
        "method": "PATCH",
        "url": "/api/users/:id/status",
        "description": "Update user status (Admin only)",
        "auth": "Required (Admin)"
      },
      "deleteUser": {
        "method": "DELETE",
        "url": "/api/users/:id",
        "description": "Delete rejected user (Admin only)",
        "auth": "Required (Admin)"
      }
    }
  }
}
```

### List Users
```http
GET /api/users
```
**Description**: List all users with optional filters  
**Authentication**: JWT Token + Admin Role Required  
**Query Parameters**:
- `search` - Search by name/email
- `role` - Filter by role
- `status` - Filter by status
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Get Pending Users
```http
GET /api/users/pending
```
**Description**: Get users with PENDING status  
**Authentication**: JWT Token + Admin Role Required  

### Update User Status
```http
PATCH /api/users/:id/status
```
**Description**: Update user status (PENDING/APPROVED/REJECTED)  
**Authentication**: JWT Token + Admin Role Required  
**Request Body**:
```json
{
  "status": "APPROVED"
}
```

### Delete Rejected User
```http
DELETE /api/users/:id
```
**Description**: Delete a rejected user  
**Authentication**: JWT Token + Admin Role Required  

---

## 📋 Task Management Endpoints

### Tasks Information
```http
GET /api/tasks/info
```
**Description**: Task management endpoints information  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Tasks API endpoints information",
  "data": {
    "description": "Task management endpoints",
    "endpoints": {
      "createTask": {
        "method": "POST",
        "url": "/api/tasks",
        "description": "Create new task (Admin/Mentor)",
        "auth": "Required"
      },
      "submitTask": {
        "method": "POST",
        "url": "/api/tasks/:taskId/submit",
        "description": "Submit task solution (Intern)",
        "auth": "Required"
      },
      "updateTaskStatus": {
        "method": "PUT",
        "url": "/api/tasks/:taskId/users/:userId/status",
        "description": "Update task status (Admin/Mentor)",
        "auth": "Required (Admin/Mentor)"
      },
      "getTasksByYear": {
        "method": "GET",
        "url": "/api/tasks/year/:year",
        "description": "Get tasks by year",
        "auth": "Required"
      },
      "getUserTasks": {
        "method": "GET",
        "url": "/api/tasks/users/:userId",
        "description": "Get tasks for specific user",
        "auth": "Required"
      }
    }
  }
}
```

### Create Task
```http
POST /api/tasks
```
**Description**: Create a new task  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "deadline": "2025-12-31T23:59:59Z",
  "angkatan": 2025
}
```

### Submit Task
```http
POST /api/tasks/:taskId/submit
```
**Description**: Submit task solution  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "submission_content": "Task solution content or URL"
}
```

### Update Task Status
```http
PUT /api/tasks/:taskId/users/:userId/status
```
**Description**: Update task status (Admin/Mentor only)  
**Authentication**: JWT Token + Admin Role Required  
**Request Body**:
```json
{
  "status": "IN_PROGRESS",
  "submission_status": "IN_REVIEW"
}
```

### Get Tasks by Year
```http
GET /api/tasks/year/:year
```
**Description**: Get tasks for specific year  
**Authentication**: JWT Token Required  

### Get User Tasks
```http
GET /api/tasks/users/:userId
```
**Description**: Get tasks for specific user  
**Authentication**: JWT Token Required  

---

## 📝 Posts Management Endpoints

### Posts Information
```http
GET /api/posts/info
```
**Description**: Posts management endpoints information  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Posts API endpoints information",
  "data": {
    "description": "Endpoints for managing learning posts",
    "endpoints": {
      "getPosts": {
        "method": "GET",
        "url": "/api/posts",
        "description": "Get list of posts with optional filters"
      },
      "createPost": {
        "method": "POST",
        "url": "/api/posts",
        "description": "Create a new post"
      },
      "getPost": {
        "method": "GET",
        "url": "/api/posts/:id",
        "description": "Get post details by ID"
      },
      "updatePost": {
        "method": "PATCH",
        "url": "/api/posts/:id",
        "description": "Update post by ID"
      },
      "deletePost": {
        "method": "DELETE",
        "url": "/api/posts/:id",
        "description": "Delete post by ID"
      }
    }
  }
}
```

### Create Post
```http
POST /api/posts
```
**Description**: Create a new post  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "title": "Post Title",
  "content": "Post content",
  "angkatan": 2025
}
```

### List Posts
```http
GET /api/posts/list
```
**Description**: Get all posts with optional filters  
**Authentication**: JWT Token Required  
**Query Parameters**:
- `angkatan` - Filter by year
- `user_id` - Filter by user

### Get Post by ID
```http
GET /api/posts/:id
```
**Description**: Get specific post by ID  
**Authentication**: JWT Token Required  

### Update Post
```http
PATCH /api/posts/:id
```
**Description**: Update post by ID  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete Post
```http
DELETE /api/posts/:id
```
**Description**: Delete post by ID  
**Authentication**: JWT Token Required  

### Add Comment to Post
```http
POST /api/posts/:id/comments
```
**Description**: Add comment to a post  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "content": "Comment content"
}
```

### Get Post Comments
```http
GET /api/posts/:id/comments
```
**Description**: Get comments for a post  
**Authentication**: JWT Token Required  

### Toggle Like on Post
```http
POST /api/posts/:id/likes
```
**Description**: Like or unlike a post  
**Authentication**: JWT Token Required  
**Response**:
```json
{
  "status": "success",
  "data": {
    "liked": true
  }
}
```

### Get User Posts
```http
GET /api/posts/user/:userId
```
**Description**: Get posts by specific user  
**Authentication**: JWT Token Required  

---

## 📚 Resources Management Endpoints

### Resources Information
```http
GET /api/resources/info
```
**Description**: Resources management endpoints information  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Resources API endpoints information",
  "data": {
    "description": "Endpoints for managing learning resources",
    "endpoints": {
      "getResources": {
        "method": "GET",
        "url": "/api/resources",
        "description": "Get list of resources"
      },
      "createResource": {
        "method": "POST",
        "url": "/api/resources",
        "description": "Create a new resource"
      },
      "getByYear": {
        "method": "GET",
        "url": "/api/resources/year/:year",
        "description": "Get resources by year"
      }
    }
  }
}
```

### Create Resource
```http
POST /api/resources
```
**Description**: Create a new learning resource  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "title": "Resource Title",
  "description": "Resource Description",
  "url": "https://example.com/resource",
  "type": "DOCUMENT",
  "angkatan": 2025
}
```

### Get Resources by Year
```http
GET /api/resources/year/:year
```
**Description**: Get resources for specific year  
**Authentication**: JWT Token Required  

### Get User Resources
```http
GET /api/resources/users/:userId
```
**Description**: Get resources created by specific user  
**Authentication**: JWT Token Required  

---

## 💬 Comments Management Endpoints

### Comments Information
```http
GET /api/comments/info
```
**Description**: Comments management endpoints information  
**Authentication**: None  
**Response**:
```json
{
  "status": "success",
  "message": "Comments API endpoints information",
  "data": {
    "description": "Endpoints for managing comments on posts and resources",
    "endpoints": {
      "getComments": {
        "method": "GET",
        "url": "/api/comments",
        "description": "Get list of comments"
      },
      "createComment": {
        "method": "POST",
        "url": "/api/comments/posts/:postId",
        "description": "Create a new comment on a post"
      }
    }
  }
}
```

### Comment on Post
```http
POST /api/comments/posts/:postId
```
**Description**: Add comment to a post  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "content": "Comment content"
}
```

### Get Post Comments
```http
GET /api/comments/posts/:postId
```
**Description**: Get comments for a post  
**Authentication**: JWT Token Required  

### Comment on Task
```http
POST /api/comments/tasks/:taskId
```
**Description**: Add comment to a task  
**Authentication**: JWT Token Required  
**Request Body**:
```json
{
  "content": "Comment content"
}
```

### Get Task Comments
```http
GET /api/comments/tasks/:taskId
```
**Description**: Get comments for a task  
**Authentication**: JWT Token Required  

---

## 📚 Documentation Endpoints

### Swagger UI
```http
GET /api/docs
```
**Description**: Interactive API documentation (Development only)  
**Authentication**: None  

### OpenAPI JSON
```http
GET /api/docs-json
```
**Description**: OpenAPI specification in JSON format  
**Authentication**: None  

### OpenAPI YAML
```http
GET /api/docs-yaml
```
**Description**: OpenAPI specification in YAML format  
**Authentication**: None  

---

## 📊 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

---

## 🔒 Authentication

### JWT Token
All protected endpoints require JWT token in header:
```http
Authorization: Bearer your-jwt-token-here
```

### User Roles
- **ADMIN**: Full access to all endpoints
- **MENTOR**: Access to task management and user guidance
- **USER**: Basic access for learning and submission

### User Status
- **PENDING**: User awaiting approval
- **APPROVED**: Active user with full access
- **REJECTED**: User denied access

---

## 🧪 Testing Examples

### Public Endpoints (Browser/GET)
```bash
# Root endpoint
curl https://learnhubbackenddev.vercel.app/

# API information
curl https://learnhubbackenddev.vercel.app/api

# Health check
curl https://learnhubbackenddev.vercel.app/api/health

# Auth information
curl https://learnhubbackenddev.vercel.app/api/auth

# Users information
curl https://learnhubbackenddev.vercel.app/api/users/info

# Tasks information
curl https://learnhubbackenddev.vercel.app/api/tasks/info

# Posts information
curl https://learnhubbackenddev.vercel.app/api/posts/info

# Resources information
curl https://learnhubbackenddev.vercel.app/api/resources/info

# Comments information
curl https://learnhubbackenddev.vercel.app/api/comments/info
```

### Authentication Examples
```bash
# User Registration
curl -X POST https://learnhubbackenddev.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "USER",
    "division_id": "div-123",
    "angkatan": 2025,
    "school_name": "University Example"
  }'

# User Login
curl -X POST https://learnhubbackenddev.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Current User
curl -X GET https://learnhubbackenddev.vercel.app/api/auth/me \
  -H "Authorization: Bearer your-jwt-token"
```

### Protected Endpoints Examples
```bash
# Create Post
curl -X POST https://learnhubbackenddev.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post content",
    "angkatan": 2025
  }'

# Update User Status (Admin only)
curl -X PATCH https://learnhubbackenddev.vercel.app/api/users/user-id/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-jwt-token" \
  -d '{
    "status": "APPROVED"
  }'
```

---

## 📈 Endpoint Summary

| Category | Public | Auth Required | Admin Only | Total |
|----------|--------|---------------|------------|-------|
| **Root** | 3 | 0 | 0 | 3 |
| **API Info** | 4 | 0 | 0 | 4 |
| **Auth** | 6 | 1 | 0 | 7 |
| **Users** | 1 | 0 | 4 | 5 |
| **Tasks** | 1 | 4 | 1 | 6 |
| **Posts** | 1 | 9 | 0 | 10 |
| **Resources** | 1 | 3 | 0 | 4 |
| **Comments** | 1 | 4 | 0 | 5 |
| **Docs** | 3 | 0 | 0 | 3 |
| **TOTAL** | **21** | **21** | **5** | **47** |

---

## 🚨 Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **408**: Request Timeout
- **500**: Internal Server Error

---

## 🎯 Quick Reference

### Most Used Endpoints
```
GET  /                           - Welcome message
GET  /api                        - API information
GET  /api/health                 - Health check
POST /api/auth/register          - User registration
POST /api/auth/login             - User login
GET  /api/auth/me                - Current user
GET  /api/posts/list             - List posts
POST /api/posts                  - Create post
```

### Authentication Flow
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login` → Get JWT token
3. Use token: Add `Authorization: Bearer token` to headers
4. Access protected endpoints

---

**🎉 All endpoints are fully functional and ready for integration!**