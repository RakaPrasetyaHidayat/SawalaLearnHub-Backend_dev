# 🗄️ Database Setup Guide - LearnHub API

## 📊 Current Database Status

### **Admin User Data Found:**
```json
{
  "idx": 0,
  "id": "caae73eb-cdcd-44ba-93dc-3baccfc6033c",
  "email": "admin@example.com",
  "full_name": "Default Admin",
  "password": "$2a$06$533M1JKOD7x44WGyiLd3nu1uKaD6BwYnE9SpepWt.d0F2xfW7daAq",
  "role": "ADMIN",
  "status": "APPROVED",
  "channel_year": 2025,
  "created_at": "2025-08-27 12:35:54.779576+00"
}
```

## 🔧 **Database Configuration Issues Fixed**

### **1. Password Field Compatibility**
- **Issue**: AuthService was looking for `password_hash` but database uses `password`
- **Fix**: Updated AuthService to check both fields for compatibility

### **2. Field Mapping**
- **Issue**: DTO used `angkatan` but database uses `channel_year`
- **Fix**: Made both fields optional in RegisterDto

### **3. Response Format**
- **Issue**: Inconsistent response format
- **Fix**: Standardized all responses to use `{ status, message, data }` format

## 🔐 **Password Setup**

### **Current Issue:**
The existing password hash `$2a$06$533M1JKOD7x44WGyiLd3nu1uKaD6BwYnE9SpepWt.d0F2xfW7daAq` doesn't match common passwords.

### **Solution Options:**

#### **Option 1: Update Database Password (Recommended)**
Run this SQL query in your Supabase database:

```sql
UPDATE users 
SET password = '$2a$10$E/YLXjxCZR6JRVp8miMSf.KZFu9VmXENV370hbUJNX0hd2UATn3Lu' 
WHERE email = 'admin@example.com';
```

**Login Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

#### **Option 2: Alternative Passwords**
Choose one of these password hashes:

```sql
-- For password: "password123"
UPDATE users SET password = '$2a$10$sOXuDIeXuuAN/J2q7dQxkOO0UBJVryJ8YQmughOn9/LAZdd4n08ti' WHERE email = 'admin@example.com';

-- For password: "learnhub123"
UPDATE users SET password = '$2a$10$uyBsyP94vzo0GI6lafRGfObj02PKQxSSj1b5/KSC/ml7Jaod89u2K' WHERE email = 'admin@example.com';

-- For password: "admin"
UPDATE users SET password = '$2a$10$R3qRMIR2rAQfTsxemrFNbOSnHcD5FrC2ZQ59vwFc/I2tZG/oqezOm' WHERE email = 'admin@example.com';
```

## 🧪 **Testing the Setup**

### **1. Test Login Endpoint**
```bash
# Test with GET method (browser-friendly)
curl "https://learnhubbackenddev.vercel.app/api/auth/login?email=admin@example.com&password=admin123"
```

### **2. Expected Response**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "caae73eb-cdcd-44ba-93dc-3baccfc6033c",
      "email": "admin@example.com",
      "full_name": "Default Admin",
      "role": "ADMIN",
      "status": "APPROVED",
      "channel_year": 2025
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **3. Test Protected Endpoint**
```bash
# Test /api/auth/me with JWT token
curl -X GET "https://learnhubbackenddev.vercel.app/api/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### **4. Test Admin Endpoints**
```bash
# List all users (Admin only)
curl -X GET "https://learnhubbackenddev.vercel.app/api/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📋 **Database Schema Requirements**

### **Users Table Structure:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,  -- bcrypt hashed password
  role VARCHAR DEFAULT 'USER', -- USER, ADMIN, MENTOR
  status VARCHAR DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  channel_year INTEGER,
  division_id VARCHAR,
  school_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Indexes for Performance:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_channel_year ON users(channel_year);
```

## 🔒 **Security Configuration**

### **JWT Configuration:**
- **Secret**: Set in environment variable `JWT_SECRET`
- **Expiration**: Default token expiration (configurable)
- **Algorithm**: HS256

### **Password Hashing:**
- **Library**: bcryptjs
- **Salt Rounds**: 10 (recommended for production)
- **Compatibility**: Supports both `password` and `password_hash` fields

### **Role-Based Access:**
- **ADMIN**: Full access to all endpoints
- **MENTOR**: Access to task management
- **USER**: Basic access for learning

## 🚀 **Deployment Checklist**

### **Before Testing:**
1. ✅ Update admin password in database
2. ✅ Verify Supabase connection
3. ✅ Check environment variables
4. ✅ Deploy latest code to Vercel

### **After Setup:**
1. ✅ Test admin login
2. ✅ Test JWT token generation
3. ✅ Test protected endpoints
4. ✅ Test role-based access

## 🎯 **Quick Test Commands**

### **Test Login (Browser URL):**
```
https://learnhubbackenddev.vercel.app/api/auth/login?email=admin@example.com&password=admin123
```

### **Test API Info:**
```
https://learnhubbackenddev.vercel.app/api/auth
```

### **Test Health Check:**
```
https://learnhubbackenddev.vercel.app/api/health
```

## 📞 **Troubleshooting**

### **Common Issues:**

#### **1. "Invalid credentials" Error**
- **Cause**: Password hash doesn't match
- **Solution**: Update password hash in database

#### **2. "Cannot connect to database" Error**
- **Cause**: Supabase configuration issue
- **Solution**: Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in environment

#### **3. "JWT token invalid" Error**
- **Cause**: JWT_SECRET mismatch
- **Solution**: Verify `JWT_SECRET` environment variable

#### **4. "Unauthorized" on Admin Endpoints**
- **Cause**: User role is not ADMIN
- **Solution**: Check user role in database

## 🎉 **Success Indicators**

When everything is working correctly, you should see:

1. ✅ Login returns JWT token
2. ✅ `/api/auth/me` returns user data
3. ✅ Admin endpoints accessible with admin token
4. ✅ Role-based access control working
5. ✅ All endpoints return proper JSON responses

**Database is now configured and ready for testing!** 🚀