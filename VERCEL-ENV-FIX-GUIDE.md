# 🔧 Vercel Environment Variables Fix Guide

## 🚨 **Problem Identified**

### **Error Message:**
```json
{
  "status": "error",
  "message": "Failed to retrieve users from database",
  "error": "TypeError: Request cannot be constructed from a URL that includes credentials: postgresql://postgres:9f%vxFZ&Ut4nNpt%20@db.zjtpufpqfcemtqpepkhe.supabase.co:5432/postgres/rest/v1/users?select=*&order=created_at.desc",
  "statusCode": 500
}
```

### **Root Cause:**
Vercel environment variables menggunakan **PostgreSQL connection string** instead of **HTTP URL** untuk Supabase REST API.

## ❌ **Wrong Configuration (Current in Vercel):**
```
SUPABASE_URL = postgresql://postgres:9f%vxFZ&Ut4nNpt%20@db.zjtpufpqfcemtqpepkhe.supabase.co:5432/postgres
```

## ✅ **Correct Configuration (Should be):**
```
SUPABASE_URL = https://zjtpufpqfcemtqpepkhe.supabase.co
```

## 🔧 **How to Fix Vercel Environment Variables**

### **Method 1: Via Vercel Dashboard**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `learnhub_backend_dev`

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in sidebar

3. **Update Environment Variables**
   - Find `SUPABASE_URL` variable
   - Click "Edit" button
   - Replace with: `https://zjtpufpqfcemtqpepkhe.supabase.co`
   - Click "Save"

4. **Verify Other Variables**
   - `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdHB1ZnBxZmNlbXRxcGVwa2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjQyMDAsImV4cCI6MjA3MTI0MDIwMH0.O7lKWJRj3AndmPXCzdvlXv0WLju4cn2zn25lcazLUDc`
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdHB1ZnBxZmNlbXRxcGVwa2hlIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY2NDIwMCwiZXhwIjoyMDcxMjQwMjAwfQ.lo7ntm-zf7cpEge4s_UwFLLGx2qsigSruQAqjtsY8oM`

5. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on latest deployment
   - Or push new commit to trigger deployment

### **Method 2: Via Vercel CLI**

```bash
# Set correct SUPABASE_URL
vercel env add SUPABASE_URL production
# Enter: https://zjtpufpqfcemtqpepkhe.supabase.co

# Set SUPABASE_ANON_KEY
vercel env add SUPABASE_ANON_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdHB1ZnBxZmNlbXRxcGVwa2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjQyMDAsImV4cCI6MjA3MTI0MDIwMH0.O7lKWJRj3AndmPXCzdvlXv0WLju4cn2zn25lcazLUDc

# Set SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdHB1ZnBxZmNlbXRxcGVwa2hlIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY2NDIwMCwiZXhwIjoyMDcxMjQwMjAwfQ.lo7ntm-zf7cpEge4s_UwFLLGx2qsigSruQAqjtsY8oM

# Redeploy
vercel --prod
```

## 📋 **Complete Environment Variables List**

### **Required for Supabase:**
```
SUPABASE_URL = https://zjtpufpqfcemtqpepkhe.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdHB1ZnBxZmNlbXRxcGVwa2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjQyMDAsImV4cCI6MjA3MTI0MDIwMH0.O7lKWJRj3AndmPXCzdvlXv0WLju4cn2zn25lcazLUDc
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdHB1ZnBxZmNlbXRxcGVwa2hlIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY2NDIwMCwiZXhwIjoyMDcxMjQwMjAwfQ.lo7ntm-zf7cpEge4s_UwFLLGx2qsigSruQAqjtsY8oM
SUPABASE_JWT_SECRET = GyejE19T/NTCj8ViuWqIGEbDX3GrP3yyvw46m/HwtDuYpDed1Hoj1xNI2s6oTO7AXl7xPj3uwlDJxF4aj7hBHw==
```

### **Required for JWT:**
```
JWT_SECRET = GyejE19T/NTCj8ViuWqIGEbDX3GrP3yyvw46m/HwtDuYpDed1Hoj1xNI2s6oTO7AXl7xPj3uwlDJxF4aj7hBHw==
```

### **Optional (App Config):**
```
NODE_ENV = production
PORT = 3001
API_GLOBAL_PREFIX = api
API_ENABLE_CORS = true
API_CORS_ORIGIN = *
API_CORS_CREDENTIALS = true
API_TIMEOUT = 10000
API_ENABLE_CACHE = true
API_CACHE_EXPIRATION = 300
```

## 🧪 **Testing After Fix**

### **1. Test Database Users Endpoint**
```bash
curl "https://learnhubbackenddev.vercel.app/api/users/all"
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "All users retrieved from database",
  "data": {
    "users": [
      {
        "id": "caae73eb-cdcd-44ba-93dc-3baccfc6033c",
        "email": "admin@example.com",
        "full_name": "Default Admin",
        "role": "ADMIN",
        "status": "APPROVED",
        "channel_year": 2025
      }
    ],
    "count": 1,
    "timestamp": "2025-01-28T10:00:00.000Z"
  }
}
```

### **2. Test Login Endpoint**
```bash
curl "https://learnhubbackenddev.vercel.app/api/auth/login?email=admin@example.com&password=admin123"
```

## 🔍 **Verification Steps**

### **1. Check Environment Variables**
```bash
# List all environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.vercel
```

### **2. Check Deployment Logs**
- Go to Vercel Dashboard
- Click on latest deployment
- Check "Functions" tab for any errors
- Look for Supabase connection logs

### **3. Test Endpoints**
- `/api/users/all` - Should show database users
- `/api/auth/login` - Should work with correct credentials
- `/api/health` - Should show service status

## 🚨 **Common Issues**

### **Issue 1: Still Getting PostgreSQL URL Error**
**Solution**: Clear browser cache and wait 2-3 minutes for Vercel to propagate changes

### **Issue 2: "Missing Supabase configuration" Error**
**Solution**: Verify all 4 Supabase environment variables are set correctly

### **Issue 3: "Invalid credentials" on Login**
**Solution**: Update admin password in database first

## 📝 **Step-by-Step Fix Process**

1. ✅ **Update Vercel Environment Variables**
   - Set correct `SUPABASE_URL` (HTTPS, not PostgreSQL)
   - Verify `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`

2. ✅ **Redeploy Application**
   - Push new commit or manual redeploy
   - Wait for deployment to complete

3. ✅ **Update Database Password**
   ```sql
   UPDATE users 
   SET password = '$2a$10$E/YLXjxCZR6JRVp8miMSf.KZFu9VmXENV370hbUJNX0hd2UATn3Lu' 
   WHERE email = 'admin@example.com';
   ```

4. ✅ **Test Endpoints**
   - Test `/api/users/all` for database connection
   - Test `/api/auth/login` for authentication

## 🎯 **Success Indicators**

When fixed correctly, you should see:

1. ✅ `/api/users/all` returns user data from database
2. ✅ `/api/auth/login` works with admin credentials
3. ✅ No more "Request cannot be constructed" errors
4. ✅ Proper JSON responses from all endpoints

**Fix the Vercel environment variables and the database endpoints will work perfectly!** 🚀