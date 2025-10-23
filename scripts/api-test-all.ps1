param(
  [Parameter(Mandatory=$false)][string]$BaseUrl = 'https://learnhubbackenddev.vercel.app/api',
  [Parameter(Mandatory=$false)][string]$AdminToken = $env:ADMIN_TOKEN,
  [Parameter(Mandatory=$false)][string]$UserToken = $env:USER_TOKEN
)

function Invoke-Api {
  param(
    [string]$Method,
    [string]$Url,
    [hashtable]$Headers
  )
  try {
    $resp = Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers -TimeoutSec 30 -ErrorAction Stop
    return @{ ok = $true; status = 200; data = $resp }
  } catch {
    $err = $_.Exception.Response
    if ($err -and $err.StatusCode) {
      $body = ''
      try { $body = (New-Object System.IO.StreamReader($err.GetResponseStream())).ReadToEnd() } catch {}
      return @{ ok = $false; status = [int]$err.StatusCode; body = $body }
    }
    return @{ ok = $false; status = -1; body = $_.Exception.Message }
  }
}

if (-not $AdminToken) { Write-Error 'ADMIN_TOKEN is required'; exit 1 }
if (-not $UserToken) { $UserToken = $AdminToken }

$adminHeaders = @{ 'Authorization' = "Bearer $AdminToken" }
$userHeaders  = @{ 'Authorization' = "Bearer $UserToken" }

$script:failures = @()
function Assert-OK {
  param([string]$Name, $Result, [int[]]$AcceptCodes = @(200))
  if (-not ($AcceptCodes -contains $Result.status)) {
    $script:failures += @{ name=$Name; status=$Result.status; body=$Result.body }
    Write-Host "[FAIL] $Name -> $($Result.status)" -f Red
  } else {
    Write-Host "[OK]   $Name" -f Green
  }
}

Write-Host "Base URL: $BaseUrl" -f Cyan

# Health
Assert-OK 'Root /' (Invoke-Api GET ($BaseUrl.TrimEnd('/')) @{}) @(200,404)
Assert-OK 'Ping' (Invoke-Api GET ("$BaseUrl/ping") @{}) @(200)
Assert-OK 'Health' (Invoke-Api GET ("$BaseUrl/health") @{}) @(200)

# Users
Assert-OK 'Users ping' (Invoke-Api GET ("$BaseUrl/users/ping") @{}) @(200)
Assert-OK 'Users all (admin)' (Invoke-Api GET ("$BaseUrl/users/all") $adminHeaders) @(200)
Assert-OK 'Users info' (Invoke-Api GET ("$BaseUrl/users/info") @{}) @(200)
Assert-OK 'Users by year path' (Invoke-Api GET ("$BaseUrl/users/year/2025") $adminHeaders) @(200)
Assert-OK 'Users division ids (path)' (Invoke-Api GET ("$BaseUrl/users/year/2025/division_id") $adminHeaders) @(200)
Assert-OK 'Users division ids (query)' (Invoke-Api GET ("$BaseUrl/users/year/division_id?year=2025") $adminHeaders) @(200)

# Tasks
Assert-OK 'Tasks info' (Invoke-Api GET ("$BaseUrl/tasks/info") @{}) @(200)
Assert-OK 'Tasks status options' (Invoke-Api GET ("$BaseUrl/tasks/status-options") $adminHeaders) @(200)
Assert-OK 'Tasks list (admin)' (Invoke-Api GET ("$BaseUrl/tasks") $adminHeaders) @(200, 204)
Assert-OK 'Tasks by year (query)' (Invoke-Api GET ("$BaseUrl/tasks/year?year=2025") $adminHeaders) @(200)

# Resources
Assert-OK 'Resources info' (Invoke-Api GET ("$BaseUrl/resources/info") @{}) @(200)
Assert-OK 'Resources list (admin)' (Invoke-Api GET ("$BaseUrl/resources") $adminHeaders) @(200)

# Posts (read-only)
Assert-OK 'Posts list' (Invoke-Api GET ("$BaseUrl/posts/list") $adminHeaders) @(200)

# Comments
Assert-OK 'Comments info' (Invoke-Api GET ("$BaseUrl/comments/info") @{}) @(200)

if ($script:failures.Count -gt 0) {
  Write-Host "`n=== FAILURES ($($script:failures.Count)) ===" -f Red
  $script:failures | ForEach-Object { Write-Host ("- {0}: {1}`n{2}" -f $_.name, $_.status, $_.body) -f Red }
  exit 2
} else {
  Write-Host "`nAll API checks passed" -f Green
  exit 0
}