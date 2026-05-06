# CapitalFlow - Arranque local sin Docker (npm run start por proyecto)
# Uso: .\start-local.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$pidFile = Join-Path $PSScriptRoot '.local-dev.pids'

$services = @(
    @{ Name = 'shell';               Path = 'shell';               Cmd = 'npm run start';     Port = 4200; Url = 'http://localhost:4200'; Desc = 'Angular 18 shell (Module Federation host)' },
    @{ Name = 'mfe-analytics-react'; Path = 'mfe-analytics-react'; Cmd = 'npm run start';     Port = 4201; Url = 'http://localhost:4201'; Desc = 'React 18 microfrontend (Web Component)' },
    @{ Name = 'mfe-payments';        Path = 'mfe-payments';        Cmd = 'npm run start';     Port = 4202; Url = 'http://localhost:4202'; Desc = 'Angular 17 microfrontend (cross-version MF)' },
    @{ Name = 'storybook';           Path = 'shared-ui';           Cmd = 'npm run storybook'; Port = 6006; Url = 'http://localhost:6006'; Desc = 'shared-ui component docs' }
)

if (Test-Path $pidFile) {
    Write-Host ''
    Write-Host '[WARN] Existe .local-dev.pids de un arranque previo. Ejecuta .\stop-local.ps1 antes de continuar.' -ForegroundColor Yellow
    exit 1
}

# Pre-flight: verifica que los puertos estan libres
$busy = @()
foreach ($svc in $services) {
    $listening = Get-NetTCPConnection -LocalPort $svc.Port -State Listen -ErrorAction SilentlyContinue
    if ($listening) { $busy += $svc }
}
if ($busy.Count -gt 0) {
    Write-Host ''
    Write-Host '[FAIL] Puertos ya ocupados:' -ForegroundColor Red
    $busy | ForEach-Object { Write-Host ("  {0,-22} -> puerto {1} en uso" -f $_.Name, $_.Port) -ForegroundColor Red }
    Write-Host '(libera los puertos o ejecuta .\stop-local.ps1 / .\stop.ps1)' -ForegroundColor Yellow
    exit 1
}

Write-Host ''
Write-Host '=== CapitalFlow: arranque local sin Docker ===' -ForegroundColor Cyan
Write-Host '(cada servicio se levanta en su propia ventana de PowerShell)' -ForegroundColor DarkGray
Write-Host ''

$launched = @()
foreach ($svc in $services) {
    $projectDir = Join-Path $PSScriptRoot $svc.Path
    if (-not (Test-Path (Join-Path $projectDir 'package.json'))) {
        Write-Host ("[FAIL] {0}: no se encuentra {1}\package.json" -f $svc.Name, $projectDir) -ForegroundColor Red
        exit 1
    }
    Write-Host ("Lanzando {0,-22} ({1})..." -f $svc.Name, $svc.Cmd) -ForegroundColor White

    $inner = @"
`$Host.UI.RawUI.WindowTitle = 'CapitalFlow: $($svc.Name)'
Set-Location -LiteralPath '$projectDir'
Write-Host '== CapitalFlow $($svc.Name) ==' -ForegroundColor Cyan
Write-Host 'Comando: $($svc.Cmd)' -ForegroundColor DarkGray
Write-Host ''
$($svc.Cmd)
"@

    $proc = Start-Process powershell -ArgumentList '-NoExit', '-Command', $inner -PassThru
    $launched += [pscustomobject]@{ Name = $svc.Name; Pid = $proc.Id; Port = $svc.Port }
}

# Persistir PIDs para que stop-local.ps1 sepa que matar
$launched | ConvertTo-Json | Out-File -FilePath $pidFile -Encoding utf8

Write-Host ''
Write-Host 'Esperando a que los servicios respondan (max 180s)...' -ForegroundColor Yellow
Write-Host '(la primera compilacion suele tardar 60-120s)' -ForegroundColor DarkGray

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
    $pending | ForEach-Object { Write-Host ("  [FAIL] {0,-22} -> {1}" -f $_.Name, $_.Url) -ForegroundColor Red }
    Write-Host ''
    Write-Host 'Revisa los logs en cada ventana de PowerShell. Para todo con .\stop-local.ps1' -ForegroundColor Yellow
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
Write-Host 'Parar todo con:  .\stop-local.ps1' -ForegroundColor DarkGray
Write-Host ''
