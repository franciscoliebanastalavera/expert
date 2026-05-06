# CapitalFlow - Parada del arranque local sin Docker
# Uso: .\stop-local.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$pidFile = Join-Path $PSScriptRoot '.local-dev.pids'
$ports   = @(4200, 4201, 4202, 6006)

Write-Host ''
Write-Host '=== CapitalFlow: parando arranque local ===' -ForegroundColor Cyan

# Matar arbol de procesos (PID padre + hijos)
function Stop-ProcessTree {
    param([int]$RootPid)
    try {
        $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$RootPid" -ErrorAction SilentlyContinue
        foreach ($child in $children) { Stop-ProcessTree -RootPid $child.ProcessId }
        Stop-Process -Id $RootPid -Force -ErrorAction SilentlyContinue
    } catch { }
}

# Fase 1: matar por PIDs guardados (las ventanas powershell lanzadas por start-local)
if (Test-Path $pidFile) {
    $saved = Get-Content $pidFile -Raw | ConvertFrom-Json
    foreach ($entry in $saved) {
        $procId = $entry.Pid
        $name   = $entry.Name
        $exists = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($exists) {
            Stop-ProcessTree -RootPid $procId
            Write-Host ("  [OK]   {0,-22} (pid {1} y arbol)" -f $name, $procId) -ForegroundColor Green
        } else {
            Write-Host ("  [SKIP] {0,-22} (pid {1} ya no existe)" -f $name, $procId) -ForegroundColor DarkGray
        }
    }
    Remove-Item $pidFile -Force
} else {
    Write-Host '[WARN] No existe .local-dev.pids; intentando limpieza por puerto.' -ForegroundColor Yellow
}

# Fase 2: matar cualquier proceso huerfano que siga escuchando en los puertos
$residual = @()
foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        try {
            $proc = Get-Process -Id $c.OwningProcess -ErrorAction Stop
            Stop-ProcessTree -RootPid $c.OwningProcess
            $residual += "port $port (pid $($c.OwningProcess), $($proc.ProcessName))"
        } catch { }
    }
}
if ($residual.Count -gt 0) {
    Write-Host ''
    Write-Host 'Procesos huerfanos eliminados:' -ForegroundColor Yellow
    $residual | ForEach-Object { Write-Host ("  [OK]   {0}" -f $_) -ForegroundColor Green }
}

# Fase 3: verificar que los puertos quedan libres
Start-Sleep -Milliseconds 500
$stillBusy = @()
foreach ($port in $ports) {
    $listening = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($listening) { $stillBusy += $port }
}

Write-Host ''
if ($stillBusy.Count -eq 0) {
    Write-Host '[OK] Arranque local detenido. Puertos 4200/4201/4202/6006 libres.' -ForegroundColor Green
} else {
    Write-Host ('[WARN] Los siguientes puertos siguen ocupados: {0}' -f ($stillBusy -join ', ')) -ForegroundColor Yellow
    exit 1
}
Write-Host ''
