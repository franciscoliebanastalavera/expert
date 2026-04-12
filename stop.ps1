# CapitalFlow - Parada de todos los servicios en Docker
# Uso: .\stop.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host ''
Write-Host '=== CapitalFlow: parando contenedores Docker ===' -ForegroundColor Cyan
docker compose down | Out-Host

Write-Host ''
$running = docker compose ps --status running --quiet 2>$null

if ([string]::IsNullOrWhiteSpace($running)) {
    Write-Host '[OK] Todos los contenedores parados y la red eliminada.' -ForegroundColor Green
} else {
    Write-Host '[WARN] Algunos contenedores siguen en ejecucion:' -ForegroundColor Yellow
    docker compose ps | Out-Host
    exit 1
}
Write-Host ''
