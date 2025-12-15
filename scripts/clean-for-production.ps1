# PowerShell cleanup script — removes non-essential development files/folders
# Use with caution. This script will prompt before deleting.

$paths = @(
  'scripts',
  'docs',
  '.qodo',
  '.vercel',
  'dist'
)

Write-Host "Cleanup for production: The following paths will be removed if they exist:`n"
$paths | ForEach-Object { Write-Host " - $_" }

$confirm = Read-Host "Type DELETE to confirm and continue"
if ($confirm -ne 'DELETE') {
  Write-Host "Aborted. No files were removed."
  exit 0
}

foreach ($p in $paths) {
  if (Test-Path $p) {
    try {
      Remove-Item -LiteralPath $p -Recurse -Force -ErrorAction Stop
      Write-Host "Removed: $p"
    } catch {
      Write-Host "Failed to remove $p: $_"
    }
  } else {
    Write-Host "Not found: $p"
  }
}

Write-Host "Cleanup complete. Review repository and commit changes on a branch before pushing to main."