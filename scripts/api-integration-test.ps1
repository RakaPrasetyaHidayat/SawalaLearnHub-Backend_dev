# API integration test script for LearnHub backend
# Usage: set ADMIN_TOKEN and USER_TOKEN environment variables if available

$base = 'https://learnhubbackenddev.vercel.app/api'
$adminToken = $Env:ADMIN_TOKEN
$userToken = $Env:USER_TOKEN

function Invoke-Api {
    param($method, $url, $token=$null, $body=$null)
    $headers = @{}
    if ($token) { $headers['Authorization'] = "Bearer $token" }
    try {
        if ($body) {
            $resp = Invoke-RestMethod -Method $method -Uri $url -Headers $headers -Body ($body | ConvertTo-Json -Depth 10) -ContentType 'application/json' -ErrorAction Stop
        } else {
            $resp = Invoke-RestMethod -Method $method -Uri $url -Headers $headers -ErrorAction Stop
        }
        return @{ ok = $true; status = 200; body = $resp }
    } catch {
        $err = $_.Exception.Response
        $code = $null
        $text = $_.Exception.Message
        if ($err) {
            $code = $err.StatusCode.Value__
            try { $stream = $err.GetResponseStream(); $reader = New-Object System.IO.StreamReader($stream); $text = $reader.ReadToEnd() } catch {}
        }
        return @{ ok = $false; status = $code; body = $text }
    }
}

# Tests to run
$tests = @(
    @{ name='GET /tasks/info'; method='GET'; url="$base/tasks/info"; token=$null },
    @{ name='GET /users/division (no auth)'; method='GET'; url="$base/users/division/00000000-0000-0000-0000-000000000000"; token=$null },
    @{ name='GET /tasks/status-options'; method='GET'; url="$base/tasks/status-options"; token=$userToken },
    @{ name='GET /tasks/:taskId/submission (user)'; method='GET'; url="$base/tasks/9abcaaf6-7cd5-451e-a335-aaa023ea3489/submission"; token=$userToken },
    @{ name='GET /tasks/:taskId/submissions (admin)'; method='GET'; url="$base/tasks/9abcaaf6-7cd5-451e-a335-aaa023ea3489/submissions"; token=$adminToken },
    @{ name='GET /tasks/submissions/:id (admin)'; method='GET'; url="$base/tasks/submissions/00000000-0000-0000-0000-000000000000"; token=$adminToken },
    @{ name='GET /users/all (auth)'; method='GET'; url="$base/users/all"; token=$adminToken }
)

$results = @()
foreach ($t in $tests) {
    Write-Host "Running test: $($t.name) -> $($t.url)"
    $r = Invoke-Api -method $t.method -url $t.url -token $t.token
    if ($r.ok) { Write-Host "OK -> 200" -ForegroundColor Green } else { Write-Host "FAIL -> $($r.status) : $($r.body)" -ForegroundColor Red }
    $results += @{ test=$t.name; ok=$r.ok; status=$r.status; body=$r.body }
}

Write-Host "\nSummary:\n"
$results | ForEach-Object {
    $statusText = if ($_.ok) { 'OK' } else { 'FAILED' }
    Write-Host ("{0} => {1} ({2})" -f $_.test, $statusText, $_.status)
}

# Exit with non-zero if any failed
if ($results | Where-Object { -not $_.ok }) { exit 1 } else { exit 0 }
