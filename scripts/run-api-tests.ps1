param(
  [Parameter(Mandatory=$true)][string]$AdminToken,
  [Parameter(Mandatory=$false)][string]$UserToken = $null,
  [Parameter(Mandatory=$false)][string]$BaseUrl = 'https://learnhubbackenddev.vercel.app/api'
)
$env:ADMIN_TOKEN = $AdminToken
if ($UserToken) { $env:USER_TOKEN = $UserToken } else { $env:USER_TOKEN = $AdminToken }
Write-Host "Running tests against $BaseUrl" -f Cyan
powershell -ExecutionPolicy Bypass -File "$(Join-Path $PSScriptRoot 'api-test-all.ps1')" -BaseUrl $BaseUrl
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }