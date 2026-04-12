# CapitalFlow

Plataforma de micro frontends para banca digital construida como proyecto de evaluación
técnica en Nter. Arquitectura **Module Federation** con shell Angular 18, microfrontend
React 18 expuesto como Web Component y librería compartida `@capitalflow/shared-ui`
documentada con Storybook.

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-8-FF4785?logo=storybook&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?logo=docker&logoColor=white)
![CI](https://img.shields.io/badge/GitLab%20CI-green-success)

---

## Demo

> Las capturas se sustituyen por las imágenes reales una vez generadas.
> Ruta: `docs/img/`.

<p align="center">
  <img src="docs/img/01-hero.png" width="100%" alt="CapitalFlow hero · shell en modo light" />
</p>

### Arquitectura visual

<p align="center">
  <img src="docs/img/02-arquitectura.svg" width="100%" alt="Arquitectura Module Federation — shell Angular 18 + MFE React 18 + shared-ui" />
</p>

### Shell Angular 18

| Light mode | Dark mode | Responsive (375×812) |
|:---:|:---:|:---:|
| <img src="docs/img/03-shell-home-light.png" width="100%" alt="Home light" /> | <img src="docs/img/04-shell-home-dark.png" width="100%" alt="Home dark" /> | <img src="docs/img/05-shell-responsive.png" width="100%" alt="Responsive móvil" /> |

### Microfrontend React integrado en el shell

<p align="center">
  <img src="docs/img/06-analytics-integrado.png" width="100%" alt="MFE React montado como Web Component dentro del shell Angular" />
</p>

### Storybook — documentación de shared-ui

<p align="center">
  <img src="docs/img/09-storybook-intro.png" width="100%" alt="Landing Introduction de Storybook con hero, métricas y catálogo" />
</p>

### Pipeline GitLab CI

<p align="center">
  <img src="docs/img/12-pipeline-verde.png" width="100%" alt="Pipeline de GitLab con todas las etapas en verde" />
</p>

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Shell Angular 18 (host)                  │
│         Module Federation · Standalone · OnPush             │
│                                                             │
│   ┌──────────────┐   ┌─────────────────┐   ┌────────────┐   │
│   │ home         │   │ analytics       │   │ settings   │   │
│   │ (dashboard)  │   │ Container /     │   │            │   │
│   │              │   │ Presentational  │   │            │   │
│   └──────────────┘   └───────┬─────────┘   └────────────┘   │
│                              │                              │
│                              ▼  <mfe-analytics>             │
│                   ┌──────────────────────┐                  │
│                   │  MFE React 18        │                  │
│                   │  Web Component       │                  │
│                   │  Shadow DOM + i18n   │                  │
│                   └──────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘

            @capitalflow/shared-ui (biblioteca Angular)
              cap-* componentes · design tokens --cap-*
                    ng-packagr · Storybook 8
```

- **Shell Angular** orquesta la navegación, el theme global y la i18n.
- **MFE React** se monta como Web Component (`<mfe-analytics>`) con Shadow DOM para
  aislar estilos. Recibe idioma y tema vía atributos y los sincroniza con un
  `MutationObserver`.
- **shared-ui** expone componentes standalone con OnPush consumiendo design tokens CSS.

---

## Stack técnico

| Capa        | Tecnología |
|-------------|------------|
| Shell       | Angular 18 standalone · Module Federation (`@angular-architects/module-federation`) · Angular Signals · OnPush |
| MFE         | React 18 · Vite · Web Component con Shadow DOM · i18next |
| Librería    | Angular 18 · ng-packagr · CDK (A11y, Virtual Scroll) · Reactive Forms · ControlValueAccessor |
| Docs        | Storybook 8 (Angular builder) · MDX |
| Estilo      | SCSS · CSS Custom Properties `--cap-*` · Dark mode |
| Seguridad   | DOMPurify · DomSanitizer · security headers en nginx |
| Testing     | Karma + Jasmine + ChromeHeadless |
| Build       | nginx multi-stage (node:20-alpine → nginx:alpine) |
| CI/CD       | GitLab CI (runners Kubernetes) · pipeline multi-etapa |

---

## Quick start

### Requisitos
- Node 20 LTS
- Docker Desktop con el mirror de Google Cloud (`https://mirror.gcr.io`) si tu red
  bloquea Cloudflare R2. Detalle en [Troubleshooting](#troubleshooting).

### Levantar todo con Docker (recomendado)

```powershell
.\start.ps1
```

El script:
1. Ejecuta `docker compose up -d`.
2. Hace polling HTTP sobre los tres servicios (timeout 60 s).
3. Abre automáticamente los tres endpoints en el navegador.
4. Imprime un resumen con servicios, puertos y URLs.

```powershell
.\stop.ps1
```

Para todo con `docker compose down` y verifica que no queda ningún contenedor vivo.

### Servicios expuestos

| Servicio      | URL                       | Descripción                                |
|---------------|---------------------------|--------------------------------------------|
| shell         | http://localhost:8081     | Angular 18 shell (Module Federation host)  |
| mfe-analytics | http://localhost:8082     | React 18 microfrontend (Web Component)     |
| storybook     | http://localhost:6007     | Documentación de `@capitalflow/shared-ui`  |

### Desarrollo sin Docker

```bash
# Shell Angular
cd shell && npm start                # http://localhost:4200

# MFE React
cd mfe-analytics-react && npm start  # http://localhost:4201

# Storybook
cd shared-ui && npm run storybook    # http://localhost:6006

# Build librería
cd shared-ui && npm run build
```

---

## Estructura del repositorio

```
expert/
├── shell/                      # Angular 18 host
│   ├── src/app/
│   │   ├── home/               # Dashboard (standalone, OnPush)
│   │   ├── analytics/          # Container/Presentational
│   │   ├── core/               # services, guards, interceptors
│   │   └── shared/             # componentes compartidos del shell
│   ├── Dockerfile              # multi-stage → nginx
│   └── nginx.conf              # security headers, SPA fallback
│
├── mfe-analytics-react/        # Microfrontend React 18
│   ├── src/
│   │   ├── components/
│   │   └── i18n/
│   ├── Dockerfile
│   └── nginx.conf              # CORS para embedding cross-origin
│
├── shared-ui/                  # Librería Angular @capitalflow/shared-ui
│   ├── src/lib/                # 15 componentes cap-* + data-grid + modal a11y
│   ├── src/stories/            # Introduction.mdx (landing Storybook)
│   ├── .storybook/             # config + preview head styles
│   ├── Dockerfile              # build-storybook → nginx
│   └── ng-package.json
│
├── docker-compose.yml          # orquestación 3 servicios
├── start.ps1 / stop.ps1        # scripts con polling HTTP
├── .gitlab-ci.yml              # pipeline install/build/docker/deploy
└── README.md
```

---

## Librería shared-ui

Componentes standalone con OnPush, ControlValueAccessor cuando aplica y tokens CSS
`--cap-*`. Catálogo actual en Storybook:

- `cap-button`, `cap-card`, `cap-checkbox`, `cap-footer`, `cap-header`, `cap-modal`,
  `cap-select`, `cap-switch`, `cap-tabs`

Pendientes de story (implementados pero sin doc): `cap-datepicker`, `cap-input`,
`cap-tooltip`, `data-grid`, `modal` (A11y), `safe-html`.

Design tokens en `src/styles/_capitalflow-theme.scss`:
`--cap-primary` `#2a85c4` · `--cap-secondary` `#f47c20` · escalas de radius, sombras,
transición y tipografía.

---

## Decisiones técnicas destacables

- **Module Federation** para aislar el ciclo de release del MFE de analytics.
- **Web Component con Shadow DOM** en el MFE para evitar colisiones CSS entre frameworks
  (no hay bleed Angular ↔ React).
- **Container/Presentational** en `analytics` separando el servicio del componente de tabla.
- **CDK Virtual Scroll** en `data-grid` para renderizar miles de filas manteniendo
  menos de 20 nodos DOM.
- **Web Worker** (`export.worker.ts`) para generar CSV sin bloquear la UI.
- **Angular Signals** (`signal` + `computed`) en `ThemeService` con `Renderer2` y
  `DOCUMENT` para dark mode sin side effects globales.
- **OnPush** en todos los componentes standalone.
- **`inject()`** sustituye constructor injection en todo el proyecto.
- **Zero `any`** en todo el código (auditado con grep).
- **Security headers** en nginx: CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy, X-XSS-Protection.
- **DOMPurify + DomSanitizer** en `SafeHtmlPipe` (doble capa de sanitización).

---

## CI/CD

Pipeline GitLab (`.gitlab-ci.yml`) con 5 etapas:

```
install → build → test → docker → deploy
```

- Jobs **independientes** por módulo (`install:shell`, `install:mfe-analytics`,
  `install:shared-ui`) con reglas `changes:` para saltar los que no aplican.
- `build:shell` instala dependencias en el propio job — los runners Kubernetes de Nter
  no tienen cache compartida entre pods.
- Stage `docker` con `allow_failure: true` (sin registry configurado para el examen).
- Stage `deploy` manual.

---

## Testing

```bash
cd shell && npm test                     # Karma + Jasmine
cd mfe-analytics-react && npm test       # Vitest
cd shared-ui && npm test
```

Cobertura actual: 9 tests en verde. Objetivo a medio plazo: 30 %.

---

## Troubleshooting

### `x509: certificate is not valid for any names` en `docker pull`
Red corporativa con EDR que intercepta TLS sobre `*.r2.cloudflarestorage.com`
(CDN de Docker Hub). Configurar un mirror que no pase por Cloudflare:

`~/.docker/daemon.json`:
```json
{ "registry-mirrors": ["https://mirror.gcr.io"] }
```
Reiniciar Docker Desktop.

### `npx ng ... command not found` en CI
Los runners Kubernetes de GitLab no comparten cache entre pods. Los builds
(`build:shell`, etc.) instalan sus propias dependencias al arrancar el job.

### `Conflicting values for 'process.env.NODE_ENV'` en Storybook
Colisión benigna entre el `DefinePlugin` de `@storybook/angular` y el de Angular CLI.
Silenciada con `config.ignoreWarnings` en `shared-ui/.storybook/main.ts` (API oficial
de webpack 5).

### `[disabled]` con `[formControl]` en stories
Usar `new FormControl({value, disabled})` al crear el control en la story. Nunca
combinar `[disabled]` en el template con un `formControl` activo: la directiva
reactiva gestiona el disabled y Angular emite el warning correspondiente.

---

## Comandos útiles

```bash
# Ver logs en vivo de un servicio del compose
docker compose logs -f storybook

# Reiniciar un solo servicio
docker compose restart shell

# Parar todo y limpiar red
.\stop.ps1

# Rebuild sin cache de un servicio
docker compose build --no-cache storybook

# Build local de la librería
cd shared-ui && npm run build
```

---

## Licencia

Proyecto de evaluación interna de Nter. Uso restringido.
