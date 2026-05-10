$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host "=== CapitalFlow setup ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Building shared-ui..." -ForegroundColor Cyan
Push-Location (Join-Path $PSScriptRoot 'shared-ui')
try {
    & npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) { throw "shared-ui npm install failed" }
    & npm run build
    if ($LASTEXITCODE -ne 0) { throw "shared-ui build failed" }
} finally {
    Pop-Location
}

$projects = @('shell', 'mfe-payments', 'mfe-transactions', 'mfe-analytics-react')
$i = 2
foreach ($proj in $projects) {
    Write-Host ("[{0}/5] Installing {1}..." -f $i, $proj) -ForegroundColor Cyan
    Push-Location (Join-Path $PSScriptRoot $proj)
    try {
        & npm install
        if ($LASTEXITCODE -ne 0) { throw "$proj npm install failed" }
    } finally {
        Pop-Location
    }
    $i++
}

Write-Host ""
Write-Host "[OK] Setup complete." -ForegroundColor Green
Write-Host "Run .\start-local.ps1 to launch all services." -ForegroundColor Yellow
