Param(
  [string]$SourcePath = "C:\Users\user\Desktop\LMS\LMS-server-1030-sy",
  [string]$TargetRel = "apps/api"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$TargetPath = Join-Path $Root $TargetRel

if (-not (Test-Path $SourcePath)) {
  Write-Error "SourcePath not found: $SourcePath"
}

if (Test-Path $TargetPath) {
  Write-Host "Cleaning existing target: $TargetPath" -ForegroundColor Yellow
  Remove-Item -Recurse -Force -Path $TargetPath
}

Write-Host "Copying backend from" $SourcePath "to" $TargetPath -ForegroundColor Cyan
New-Item -ItemType Directory -Path $TargetPath | Out-Null

# Copy excluding node_modules and dist
robocopy $SourcePath $TargetPath /E /NFL /NDL /NJH /NJS /NP /XD node_modules dist .git /.turbo /.next /XF *.log

if ($LASTEXITCODE -ge 8) {
  Write-Error "robocopy failed with code $LASTEXITCODE"
}

Write-Host "Backend synced to $TargetPath" -ForegroundColor Green



