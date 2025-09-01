# 📚 LearnHub API - Complete Endpoints Documentation (Updated)

## 🌐 Base URL
```
Production: https://learnhubbackenddev.vercel.app
Development: http://localhost:3001
```

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
      "login": { "method": "GET", "url": "/api/auth/login" },
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

### User Login ⚡ **UPDATED: Now GET Method**
```http
GET /api/auth/login
```
**Description**: User login with credentials via query parameters  
**Authentication**: None  
**Query Parameters**:
- `email` - User email address (required)
- `password` - User password (required)

**Example URL**:
```
GET /api/auth/login?email=user@example.com&password=password123
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

### Get Current User
```http
GET /api/auth/me
```
**Description**: Get current authenticated user information  
**Authentication**: JWT Token Required  
**Headers**: `Authorization: Bearer jwt-token-here`  

---

## 🧪 Testing Examples

### **Updated Login Testing**

#### **Browser/URL Testing (GET Method)**
```
https://learnhubbackenddev.vercel.app/api/auth/login?email=test@example.com&password=password123
```

#### **cURL Testing**
```bash
# Login with GET method
curl "https://learnhubbackenddev.vercel.app/api/auth/login?email=test@example.com&password=password123"
```

#### **JavaScript/Fetch API**
```javascript
// Login with GET method
const login = async (email, password) => {
  const response = await fetch(`https://learnhubbackenddev.vercel.app/api/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
    method: 'GET',
    credentials: 'include'
  });
  
  const data = await response.json();
  if (data.status === 'success') {
    localStorage.setItem('token', data.data.access_token);
    return data.data;
  }
  throw new Error(data.message);
};

// Usage
login('user@example.com', 'password123')
  .then(data => console.log('Login successful:', data))
  .catch(error => console.error('Login failed:', error));
```

#### **Axios Example**
```javascript
import axios from 'axios';

// Login with GET method
const loginUser = async (email, password) => {
  const response = await axios.get('https://learnhubbackenddev.vercel.app/api/auth/login', {
    params: {
      email: email,
      password: password
    },
    withCredentials: true
  });
  return response.data;
};

// Usage
loginUser('user@example.com', 'password123')
  .then(data => console.log('Login successful:', data))
  .catch(error => console.error('Login failed:', error));
```

#### **jQuery Example**
```javascript
// Login with GET method
$.get('https://learnhubbackenddev.vercel.app/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
})
.done(function(data) {
  console.log('Login successful:', data);
  localStorage.setItem('token', data.data.access_token);
})
.fail(function(error) {
  console.error('Login failed:', error);
});
```

---

## 📋 **Updated Authentication Endpoints Summary**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth` | **GET** | Auth endpoints info | ❌ No |
| `/api/auth/register` | **POST** | User registration | ❌ No |
| `/api/auth/login` | **GET** ⚡ | User login (Query params) | ❌ No |
| `/api/auth/forgot-password` | **POST** | Password reset request | ❌ No |
| `/api/auth/reset-password` | **POST** | Reset password | ❌ No |
| `/api/auth/me` | **GET** | Get current user | ✅ Yes |

---

## 🎯 **Key Changes Made**

### ✅ **Login Method Changed**
- **Before**: `POST /api/auth/login` with JSON body
- **After**: `GET /api/auth/login` with query parameters

### ✅ **Benefits of GET Method**
- **Browser Testable**: Can test directly in browser address bar
- **Simpler Frontend**: No need for POST request body
- **URL Shareable**: Login URL can be bookmarked (though not recommended for security)
- **Cache Friendly**: Can be cached by browsers/proxies

### ⚠️ **Security Considerations**
- **URL Logging**: Credentials may appear in server logs
- **Browser History**: Login URLs stored in browser history
- **Referrer Headers**: Credentials may leak via referrer headers
- **Recommendation**: Use HTTPS and consider POST for production

---

## 🚀 **Quick Test**

Test the updated login endpoint directly in your browser:
```
https://learnhubbackenddev.vercel.app/api/auth/login?email=test@example.com&password=password123
```

**The login endpoint now uses GET method and can be tested directly in the browser!** 🎉