# CapitalFlow - Arranque local sin Docker (npm run start por proyecto)
# Uso: .\start-local.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$pidFile = Join-Path $PSScriptRoot '.local-dev.pids'
$logDir  = Join-Path $PSScriptRoot '.local-dev-logs'

$services = @(
    @{ Name = 'shell';               Path = 'shell';               Cmd = 'npm run start';     Port = 4200; Url = 'http://localhost:4200'; Desc = 'Angular 18 shell (Module Federation host)' },
    @{ Name = 'mfe-analytics-react'; Path = 'mfe-analytics-react'; Cmd = 'npm run start';     Port = 4201; Url = 'http://localhost:4201'; Desc = 'React 18 microfrontend (Web Component)' },
    @{ Name = 'mfe-payments';        Path = 'mfe-payments';        Cmd = 'npm run start';     Port = 4202; Url = 'http://localhost:4202'; Desc = 'Angular 17 microfrontend (cross-version MF)' },
    @{ Name = 'mfe-transactions';    Path = 'mfe-transactions';    Cmd = 'npm run start';     Port = 4203; Url = 'http://localhost:4203'; Desc = 'Angular 18 microfrontend (transactions domain)' },
    @{ Name = 'storybook';           Path = 'shared-ui';           Cmd = 'npm run storybook'; Port = 6006; Url = 'http://localhost:6006'; Desc = 'shared-ui component docs' }
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

Write-Host ''
Write-Host 'Esperando a que los servicios respondan (max 180s)...' -ForegroundColor Yellow
Write-Host '(la primera compilacion suele tardar 60-120s; revisa el log si algun servicio se atasca)' -ForegroundColor DarkGray
Write-Host ''

$deadline = (Get-Date).AddSeconds(180)
$pending  = [System.Collections.Generic.List[hashtable]]::new()
$services | ForEach-Object { $pending.Add($_) }

while ($pending.Count -gt 0 -and (Get-Date) -lt $deadline) {
    for ($i = $pending.Count - 1; $i -ge 0; $i--) {
        $svc = $pending[$i]
        try {
            $response = Invoke-WebRequest -Uri $svc.Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host ("  [OK]   {0,-22} -> {1}" -f $svc.Name, $svc.Url) -ForegroundColor Green
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
    Write-Host 'Timeout: los siguientes servicios no respondieron:' -ForegroundColor Red
    $pending | ForEach-Object {
        $logPath = Join-Path $logDir ("{0}.log" -f $_.Name)
        Write-Host ("  [FAIL] {0,-22} -> {1}" -f $_.Name, $_.Url) -ForegroundColor Red
        Write-Host ("         log: {0}" -f $logPath) -ForegroundColor DarkGray
    }
    Write-Host ''
    Write-Host ('Revisa los logs en {0}\ y para todo con .\stop-local.ps1' -f $logDir) -ForegroundColor Yellow
    exit 1
}

Write-Host ''
Write-Host 'Abriendo navegadores...' -ForegroundColor Cyan
$services | ForEach-Object { Start-Process $_.Url }

Write-Host ''
Write-Host '=== Servicios locales listos ===' -ForegroundColor Green
Write-Host ''
"{0,-22} {1,-28} {2}" -f 'SERVICIO', 'URL', 'DESCRIPCION' | Write-Host -ForegroundColor White
"{0,-22} {1,-28} {2}" -f ('-' * 22), ('-' * 28), ('-' * 40) | Write-Host -ForegroundColor DarkGray
$services | ForEach-Object {
    "{0,-22} {1,-28} {2}" -f $_.Name, $_.Url, $_.Desc | Write-Host
}
Write-Host ''
Write-Host ('Logs por servicio: {0}\<servicio>.log' -f $logDir) -ForegroundColor DarkGray
Write-Host ('Tail en vivo:      Get-Content -Path {0}\shell.log -Wait' -f $logDir) -ForegroundColor DarkGray
Write-Host 'Parar todo con:    .\stop-local.ps1' -ForegroundColor DarkGray
Write-Host ''
