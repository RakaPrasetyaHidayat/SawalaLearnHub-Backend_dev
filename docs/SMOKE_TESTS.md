# Smoke tests (manual)

Quick curl/PowerShell examples to sanity-check key endpoints locally.

> Replace `:PORT` with your server port (default 3000) and set Authorization header with a valid JWT.

## 1) Admin: update a user profile

PowerShell example:
```powershell
$token = "Bearer <ADMIN_TOKEN>"
$id = "<USER_UUID>"
$body = @{ full_name = "Nama Baru"; division_id = "BACKEND"; school_name = "Sekolah A" } | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/api/users/$id" -Headers @{ Authorization = $token; "Content-Type"="application/json" } -Body $body
```

## 2) Submit a task (file upload)

PowerShell (multipart/form-data):
```powershell
$token = "Bearer <USER_TOKEN>"
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/tasks/<TASK_ID>/submit" -Headers @{ Authorization = $token } -Form @{ file = Get-Item "C:\path\to\file.zip"; description = "Solution description" }
```

## 3) Get post by id

```powershell
$token = "Bearer <USER_TOKEN>"
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/posts/<POST_ID>" -Headers @{ Authorization = $token }
```

## 4) Create task (admin, with file)

```powershell
$token = "Bearer <ADMIN_TOKEN>"
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/tasks" -Headers @{ Authorization = $token } -Form @{ title = "Task 1"; description = "Desc"; channel_year = 2025; division = "BACKEND"; file = Get-Item "C:\tmp\task.pdf" }
```


If any test fails with a 4xx/5xx error, check logs in your server terminal and supabase storage/buckets and make sure service role key is set. 
