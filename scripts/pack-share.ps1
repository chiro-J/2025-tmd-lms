Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Project root = parent of this script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir '..')

# Output zip path
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outDir = Join-Path $ProjectRoot 'release'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
$zipName = "lms-share-$timestamp.zip"
$zipPath = Join-Path $outDir $zipName

# Define include list (only essential files/folders)
$include = @(
    'src',
    'index.html',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'eslint.config.js',
    '.gitignore',
    '.gitattributes',
    'README.md',
    'LICENSE'
)

# Resolve paths that actually exist
$paths = @()
foreach ($rel in $include) {
    $full = Join-Path $ProjectRoot $rel
    if (Test-Path $full) { $paths += $full }
}

if ($paths.Count -eq 0) {
    Write-Error 'No matching files to include. Check your repository layout.'
}

# Remove existing zip if any (unlikely due to timestamp)
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

# Create archive
Compress-Archive -Path $paths -DestinationPath $zipPath -Force

Write-Host "Created archive:" -ForegroundColor Green
Write-Host "  $zipPath"
Write-Host "Included items:" -ForegroundColor Cyan
$paths | ForEach-Object { Write-Host "  - $($_.Replace($ProjectRoot, '.'))" }

exit 0



