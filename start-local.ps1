# CapitalFlow - Arranque local sin Docker (npm run start por proyecto)
# Uso: .\start-local.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$pidFile = Join-Path $PSScriptRoot '.local-dev.pids'
$logDir  = Join-Path $PSScriptRoot '.local-dev-logs'

$services = @(
    @{ Name = 'shell';               Path = 'shell';               Cmd = 'npm run start';     Port = 4200; Url = 'http://localhost:4200'; Desc = 'Angular 18 shell (Module Federation host)';      OpensOwnBrowser = $false },
    @{ Name = 'mfe-analytics-react'; Path = 'mfe-analytics-react'; Cmd = 'npm run start';     Port = 4201; Url = 'http://localhost:4201'; Desc = 'React 18 microfrontend (Web Component)';         OpensOwnBrowser = $true  },
    @{ Name = 'mfe-payments';        Path = 'mfe-payments';        Cmd = 'npm run start';     Port = 4202; Url = 'http://localhost:4202'; Desc = 'Angular 17 microfrontend (cross-version MF)';   OpensOwnBrowser = $false },
    @{ Name = 'mfe-transactions';    Path = 'mfe-transactions';    Cmd = 'npm run start';     Port = 4203; Url = 'http://localhost:4203'; Desc = 'Angular 18 microfrontend (transactions domain)'; OpensOwnBrowser = $false },
    @{ Name = 'storybook';           Path = 'shared-ui';           Cmd = 'npm run storybook'; Port = 6006; Url = 'http://localhost:6006'; Desc = 'shared-ui component docs';                       OpensOwnBrowser = $true  }
)

if (Test-Path $pidFile) {
    Write-Host ''
    Write-Host '[WARN] Existe .local-dev.pids de un arranque previo. Ejecuta .\stop-local.ps1 antes de continuar.' -ForegroundColor Yellow
    exit 1
}

# Pre-flight: verifica que los puertos estan libres (uno solo por servicio, sin duplicados)
$busy = @()
foreach ($svc in $services) {
    $listening = Get-NetTCPConnection -LocalPort $svc.Port -State Listen -ErrorAction SilentlyContinue
    if ($listening) { $busy += $svc }
}
if ($busy.Count -gt 0) {
    Write-Host ''
    Write-Host '[FAIL] Puertos ya ocupados:' -ForegroundColor Red
    $busy | ForEach-Object { Write-Host ("  {0,-22} -> puerto {1} en uso" -f $_.Name, $_.Port) -ForegroundColor Red }
    Write-Host '(libera los puertos o ejecuta .\stop-local.ps1)' -ForegroundColor Yellow
    exit 1
}

# Carpeta de logs (limpia los .log previos para que cada arranque empiece en blanco)
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}
Get-ChildItem -Path $logDir -Filter '*.log' -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host ''
Write-Host '=== CapitalFlow: arranque local sin Docker ===' -ForegroundColor Cyan
Write-Host ('(esta ventana orquesta {0} servicios; los procesos corren en segundo plano sin abrir ventanas adicionales)' -f $services.Count) -ForegroundColor DarkGray
Write-Host ('Logs por servicio: {0}\<servicio>.log' -f $logDir) -ForegroundColor DarkGray
Write-Host ''

Write-Host '[1/2] Building shared-ui (ng-packagr) ...' -ForegroundColor Cyan
Push-Location (Join-Path $PSScriptRoot 'shared-ui')
try {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host '[FAIL] shared-ui build failed. Aborting.' -ForegroundColor Red
        exit 1
    }
} finally {
    Pop-Location
}
Write-Host '[OK] shared-ui/dist ready.' -ForegroundColor Green
Write-Host ''
Write-Host '[2/2] Launching services ...' -ForegroundColor Cyan
Write-Host ''

$launched = @()
foreach ($svc in $services) {
    $projectDir = Join-Path $PSScriptRoot $svc.Path
    if (-not (Test-Path (Join-Path $projectDir 'package.json'))) {
        Write-Host ("[FAIL] {0}: no se encuentra {1}\package.json" -f $svc.Name, $projectDir) -ForegroundColor Red
        exit 1
    }

    $logFile = Join-Path $logDir ("{0}.log" -f $svc.Name)
    $cmdArgs = ('/c {0} > "{1}" 2>&1' -f $svc.Cmd, $logFile)

    Write-Host ("Lanzando {0,-22} ({1}) -> log {2}" -f $svc.Name, $svc.Cmd, $logFile) -ForegroundColor White

    $proc = Start-Process -FilePath 'cmd.exe' `
        -ArgumentList $cmdArgs `
        -WorkingDirectory $projectDir `
        -WindowStyle Hidden `
        -PassThru
    $launched += [pscustomobject]@{ Name = $svc.Name; Pid = $proc.Id; Port = $svc.Port; Log = $logFile }
}

# Persistir PIDs para que stop-local.ps1 sepa que matar
$launched | ConvertTo-Json | Out-File -FilePath $pidFile -Encoding utf8

$readinessTimeoutSec = 300

Write-Host ''
Write-Host ("Esperando a que los servicios respondan (max {0}s)..." -f $readinessTimeoutSec) -ForegroundColor Yellow
Write-Host '(en cache fria la primera compilacion ng serve / storybook puede tardar 90-180s por servicio)' -ForegroundColor DarkGray
Write-Host '(los 5 servicios compilan en paralelo y compiten por CPU; el orden de ready varia segun la maquina)' -ForegroundColor DarkGray
Write-Host ''

$deadline = (Get-Date).AddSeconds($readinessTimeoutSec)
$pending  = [System.Collections.Generic.List[hashtable]]::new()
$ready    = [System.Collections.Generic.List[hashtable]]::new()
$services | ForEach-Object { $pending.Add($_) }

while ($pending.Count -gt 0 -and (Get-Date) -lt $deadline) {
    for ($i = $pending.Count - 1; $i -ge 0; $i--) {
        $svc = $pending[$i]
        try {
            $response = Invoke-WebRequest -Uri $svc.Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host ("  [OK]   {0,-22} -> {1}" -f $svc.Name, $svc.Url) -ForegroundColor Green
                $ready.Add($svc)
                $pending.RemoveAt($i)
            }
        } catch {
            # aun compilando
        }
    }
    if ($pending.Count -gt 0) { Start-Sleep -Milliseconds 2000 }
}

if ($pending.Count -gt 0) {
    Write-Host ''
    Write-Host ("Timeout tras {0}s. Servicios pendientes (siguen arrancando en segundo plano):" -f $readinessTimeoutSec) -ForegroundColor Yellow
    $pending | ForEach-Object {
        $logPath = Join-Path $logDir ("{0}.log" -f $_.Name)
        Write-Host ("  [TIMEOUT] {0,-22} -> {1}" -f $_.Name, $_.Url) -ForegroundColor Yellow
        Write-Host ("            log: {0}" -f $logPath) -ForegroundColor DarkGray
    }
    Write-Host ''
    Write-Host 'Opciones:' -ForegroundColor Yellow
    Write-Host '  1) Espera unos minutos mas y abre la URL manualmente cuando el log indique ready.' -ForegroundColor DarkGray
    Write-Host ('     Tail en vivo:   Get-Content -Path {0}\<servicio>.log -Wait' -f $logDir) -ForegroundColor DarkGray
    Write-Host '  2) Para todo:       .\stop-local.ps1' -ForegroundColor DarkGray
    Write-Host ''
}

Write-Host ''
$toOpen = @($ready | Where-Object { -not $_.OpensOwnBrowser })
$selfOpened = @($ready | Where-Object { $_.OpensOwnBrowser })
if ($toOpen.Count -gt 0) {
    Write-Host ('Abriendo navegadores para {0} servicio(s)...' -f $toOpen.Count) -ForegroundColor Cyan
    $toOpen | ForEach-Object { Start-Process $_.Url }
}
if ($selfOpened.Count -gt 0) {
    Write-Host ('Saltando apertura para {0} servicio(s) que abren su propia ventana: {1}' -f $selfOpened.Count, (($selfOpened | ForEach-Object { $_.Name }) -join ', ')) -ForegroundColor DarkGray
}
if ($toOpen.Count -eq 0 -and $selfOpened.Count -eq 0) {
    Write-Host 'Ningun servicio respondio dentro del timeout; no abro navegadores.' -ForegroundColor Yellow
}

Write-Host ''
if ($pending.Count -eq 0) {
    Write-Host '=== Todos los servicios locales listos ===' -ForegroundColor Green
} else {
    Write-Host ('=== {0}/{1} servicios listos, {2} pendiente(s) ===' -f $ready.Count, $services.Count, $pending.Count) -ForegroundColor Yellow
}
Write-Host ''
"{0,-10} {1,-22} {2,-28} {3}" -f 'ESTADO', 'SERVICIO', 'URL', 'DESCRIPCION' | Write-Host -ForegroundColor White
"{0,-10} {1,-22} {2,-28} {3}" -f ('-' * 10), ('-' * 22), ('-' * 28), ('-' * 40) | Write-Host -ForegroundColor DarkGray
$readyNames = @{}
$ready | ForEach-Object { $readyNames[$_.Name] = $true }
foreach ($svc in $services) {
    if ($readyNames.ContainsKey($svc.Name)) {
        $status  = '[ready]'
        $colour  = 'Green'
    } else {
        $status  = '[pend.]'
        $colour  = 'Yellow'
    }
    "{0,-10} {1,-22} {2,-28} {3}" -f $status, $svc.Name, $svc.Url, $svc.Desc | Write-Host -ForegroundColor $colour
}
Write-Host ''
Write-Host ('Logs por servicio: {0}\<servicio>.log' -f $logDir) -ForegroundColor DarkGray
Write-Host ('Tail en vivo:      Get-Content -Path {0}\shell.log -Wait' -f $logDir) -ForegroundColor DarkGray
Write-Host 'Parar todo con:    .\stop-local.ps1' -ForegroundColor DarkGray
Write-Host ''
