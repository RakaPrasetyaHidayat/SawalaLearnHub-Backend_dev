# LearnHub API Endpoints

## Authentication Endpoints

### Register
- **Method**: POST
- **URL**: `/api/auth/register`
- **Description**: Register a new user
- **Auth**: Not required
- **Body**:
```json
{
  "email": "string",
  "password": "string",
  "full_name": "string",
  "school_name": "string",
  "division_id": "string",
  "channel_year": "number"
}
```

### Login
- **Method**: POST
- **URL**: `/api/auth/login`
- **Description**: Login user
- **Auth**: Not required
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

### Get User Profile
- **Method**: GET
- **URL**: `/api/auth/me`
- **Description**: Get current user profile
- **Auth**: Required
- **Headers**: Authorization: Bearer {token}

## Users Endpoints

### Get Users by Division
- **Method**: GET
- **URL**: `/api/users/division/:divisionId`
- **Description**: Get all approved users in a specific division
- **Auth**: Required (Admin only)
- **Params**: divisionId (string)

### Get All Users
- **Method**: GET
- **URL**: `/api/users`
- **Description**: Get all users
- **Auth**: Required (Admin only)
- **Query Params**: 
  - page (number)
  - limit (number)
  - search (string)
  - status (string)
  - role (string)

### Get Pending Users
- **Method**: GET
- **URL**: `/api/users/pending`
- **Description**: Get users with pending status
- **Auth**: Required (Admin only)

### Update User Status
- **Method**: PATCH
- **URL**: `/api/users/:id/status`
- **Description**: Update user status (approve/reject)
- **Auth**: Required (Admin only)
- **Body**:
```json
{
  "status": "APPROVED | REJECTED"
}
```

## Posts Endpoints

### Create Post
- **Method**: POST
- **URL**: `/api/posts`
- **Description**: Create a new post
- **Auth**: Required
- **Body**: Form-data with post content and attachments

### Get Posts
- **Method**: GET
- **URL**: `/api/posts`
- **Description**: Get all posts
- **Auth**: Required
- **Query Params**:
  - page (number)
  - limit (number)
  - search (string)

### Get Post by ID
- **Method**: GET
- **URL**: `/api/posts/:id`
- **Description**: Get post details
- **Auth**: Required

### Update Post
- **Method**: PATCH
- **URL**: `/api/posts/:id`
- **Description**: Update post content
- **Auth**: Required (Post owner or Admin)

### Delete Post
- **Method**: DELETE
- **URL**: `/api/posts/:id`
- **Description**: Delete post
- **Auth**: Required (Post owner or Admin)

## Comments Endpoints

### Add Comment
- **Method**: POST
- **URL**: `/api/comments`
- **Description**: Add comment to post
- **Auth**: Required

### Get Comments
- **Method**: GET
- **URL**: `/api/comments/:postId`
- **Description**: Get comments for specific post
- **Auth**: Required

### Update Comment
- **Method**: PATCH
- **URL**: `/api/comments/:id`
- **Description**: Update comment content
- **Auth**: Required (Comment owner or Admin)

### Delete Comment
- **Method**: DELETE
- **URL**: `/api/comments/:id`
- **Description**: Delete comment
- **Auth**: Required (Comment owner or Admin)

## Resources Endpoints

### Upload Resource
- **Method**: POST
- **URL**: `/api/resources`
- **Description**: Upload learning resource
- **Auth**: Required (Admin only)

### Get Resources
- **Method**: GET
- **URL**: `/api/resources`
- **Description**: Get all learning resources
- **Auth**: Required
- **Query Params**:
  - page (number)
  - limit (number)
  - search (string)
  - type (string)

### Download Resource
- **Method**: GET
- **URL**: `/api/resources/:id/download`
- **Description**: Download specific resource
- **Auth**: Required

### Delete Resource
- **Method**: DELETE
- **URL**: `/api/resources/:id`
- **Description**: Delete resource
- **Auth**: Required (Admin only)
