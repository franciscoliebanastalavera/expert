# CapitalFlow - Arranque de todos los servicios en Docker
# Uso: .\start.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$services = @(
    @{ Name = 'shell';            Url = 'http://localhost:8081'; Desc = 'Angular 18 shell (Module Federation host)'       },
    @{ Name = 'mfe-analytics';    Url = 'http://localhost:8082'; Desc = 'React 18 microfrontend (Web Component)'          },
    @{ Name = 'mfe-payments';     Url = 'http://localhost:8083'; Desc = 'Angular 17 microfrontend (cross-version MF)'     },
    @{ Name = 'mfe-transactions'; Url = 'http://localhost:8084'; Desc = 'Angular 18 microfrontend (transactions domain)'  },
    @{ Name = 'storybook';        Url = 'http://localhost:6007'; Desc = 'shared-ui component docs'                        }
)

Write-Host ''
Write-Host '=== CapitalFlow: levantando contenedores Docker ===' -ForegroundColor Cyan
docker compose up -d

Write-Host ''
Write-Host 'Esperando a que los servicios respondan (max 60s)...' -ForegroundColor Yellow

$deadline = (Get-Date).AddSeconds(60)
$pending  = [System.Collections.Generic.List[hashtable]]::new()
$services | ForEach-Object { $pending.Add($_) }

while ($pending.Count -gt 0 -and (Get-Date) -lt $deadline) {
    for ($i = $pending.Count - 1; $i -ge 0; $i--) {
        $svc = $pending[$i]
        try {
            $response = Invoke-WebRequest -Uri $svc.Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host ("  [OK]   {0,-14} -> {1}" -f $svc.Name, $svc.Url) -ForegroundColor Green
                $pending.RemoveAt($i)
            }
        } catch {
            # still not ready, retry
        }
    }
    if ($pending.Count -gt 0) { Start-Sleep -Milliseconds 1000 }
}

if ($pending.Count -gt 0) {
    Write-Host ''
    Write-Host 'Timeout: los siguientes servicios no respondieron:' -ForegroundColor Red
    $pending | ForEach-Object { Write-Host ("  [FAIL] {0,-14} -> {1}" -f $_.Name, $_.Url) -ForegroundColor Red }
    Write-Host ''
    Write-Host 'Revisa los logs con: docker compose logs -f' -ForegroundColor Yellow
    exit 1
}

Write-Host ''
Write-Host 'Abriendo navegadores...' -ForegroundColor Cyan
$services | ForEach-Object { Start-Process $_.Url }

Write-Host ''
Write-Host '=== Servicios listos ===' -ForegroundColor Green
Write-Host ''
"{0,-14} {1,-28} {2}" -f 'SERVICIO', 'URL', 'DESCRIPCION' | Write-Host -ForegroundColor White
"{0,-14} {1,-28} {2}" -f ('-' * 14), ('-' * 28), ('-' * 40) | Write-Host -ForegroundColor DarkGray
$services | ForEach-Object {
    "{0,-14} {1,-28} {2}" -f $_.Name, $_.Url, $_.Desc | Write-Host
}
Write-Host ''
Write-Host 'Parar todo con:  .\stop.ps1' -ForegroundColor DarkGray
Write-Host 'Ver logs con:    docker compose logs -f' -ForegroundColor DarkGray
Write-Host ''
