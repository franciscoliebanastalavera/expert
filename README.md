# CapitalFlow

CapitalFlow is a practical Angular Expert evaluation project for a B2B financial
platform. The repository demonstrates an incremental migration from a fragile
front-end monolith to a micro-frontend architecture with shared UI, security
hardening, performance controls, automated tests, and Docker-based local
deployment.

## Current Stack

- Shell: Angular 18 standalone application, Module Federation host, OnPush, Signals.
- Payments MFE: Angular 17 remote exposed as a Web Component.
- Analytics MFE: React 18 remote exposed as a Web Component with Shadow DOM.
- Shared UI: `@capitalflow/shared-ui` v1.1.0, Angular component library.
- Integration: Webpack Module Federation via `@angular-architects/module-federation`.
- Styling: SCSS and CSS custom properties exposed as `--cap-*` design tokens.
- Testing: Karma/Jasmine for Angular projects, Jest for the React MFE.
- Runtime: nginx containers orchestrated by Docker Compose.

## Local Docker Stack

Build and start all services:

```bash
docker compose up -d --build
```

Stop the stack:

```bash
docker compose down
```

Service endpoints:

| Service | URL | Description |
| --- | --- | --- |
| shell | http://localhost:8081 | Angular 18 host application |
| mfe-analytics-react | http://localhost:8082 | React 18 analytics remote |
| mfe-payments | http://localhost:8083 | Angular 17 payments remote |
| storybook | http://localhost:6007 | Shared UI documentation |

## Local development without Docker

Each project can be run standalone with npm scripts. Run them in separate terminals.

### Run all projects locally

| Project | Port | Command | URL |
| --- | --- | --- | --- |
| shell | 4200 | `cd shell && npm run start` | http://localhost:4200 |
| mfe-analytics-react | 4201 | `cd mfe-analytics-react && npm run start` | http://localhost:4201 |
| mfe-payments | 4202 | `cd mfe-payments && npm run start` | http://localhost:4202 |
| shared-ui Storybook | 6006 | `cd shared-ui && npm run storybook` | http://localhost:6006 |

### Compatibility matrix: which services to run for what

| To validate | Services needed |
| --- | --- |
| Shell home, /analytics, /admin/* security demos, /design-system | shell only |
| /analytics-mfe (React MFE) | shell + mfe-analytics-react |
| /payments-mfe (Angular MFE) | shell + mfe-payments |
| All MFE integration | all 3 |
| Component library docs | shared-ui Storybook only |

### Notes

- Module Federation hosts depend on the remote `remoteEntry.js` URL. If a remote MFE is not running, the wrapper component shows a `cap-alert` with a retry button.
- For full integration testing, prefer Docker: `docker compose up -d --build`.

## Tests

Run each project test suite independently:

```bash
cd shell
npm test

cd ../shared-ui
npm test

cd ../mfe-payments
npm test

cd ../mfe-analytics-react
npm test -- --runInBand
```

Latest verified local result:

| Project | Test runner | Count |
| --- | --- | --- |
| shell | Karma/Jasmine | 128 passing |
| shared-ui | Karma/Jasmine | 181 passing |
| mfe-payments | Karma/Jasmine | 25 passing |
| mfe-analytics-react | Jest | 26 passing |

## Monorepo Layout

```text
expert/
  shell/
    src/app/
      admin/                 Security audit demos
      analytics/             Angular analytics implementation
      analytics-wrapper/     React MFE host wrapper
      payments-wrapper/      Payments MFE host wrapper
      core/                  Models and shared services
      workers/               XLSX export worker
    Dockerfile
    nginx.conf
    webpack.config.js

  mfe-analytics-react/
    src/
      App.tsx
      web-component.tsx      Registers <mfe-analytics>
    Dockerfile
    nginx.conf
    webpack.config.js

  mfe-payments/
    src/
      bootstrap.ts           Registers <mfe-payments>
    Dockerfile
    nginx.conf
    webpack.config.js

  shared-ui/
    src/lib/                 CapitalFlow component library
    .storybook/
    Dockerfile
    ng-package.json

  docker-compose.yml
  .gitlab-ci.yml
  README.md
```

## Security Demos

The shell exposes a security demo area at:

```text
http://localhost:8081/admin
```

Current demos cover:

- WYSIWYG template sanitization with Quill and DOMPurify.
- PDF report URL validation before iframe usage.
- Document filename rendering as text instead of executable HTML.
- Reflected search payload rendering through text binding.
- CSP and security headers in nginx for the shell.

These demos map the exam briefing vulnerabilities to concrete implementation
controls and tests.

## Shared UI Library

`shared-ui` contains the CapitalFlow Angular design-system implementation. The
library currently includes 21 reusable building blocks, including buttons,
alerts, cards, data tables, virtual data grid, status badges, form controls,
modal, tabs, spinner, tooltip, metric cards, and sanitization helpers.

Storybook is available through Docker at:

```text
http://localhost:6007
```

The shell consumes the source entry point through TypeScript path mapping:

```text
@capitalflow/shared-ui -> ../shared-ui/src/public-api-source.ts
```

## Architecture Notes

- The shell owns routing, global layout, language selection, theme state, and
  remote loading.
- Angular and React MFEs are integrated through Web Components so teams can
  keep their framework choices without blocking each other.
- Shared UI and design tokens provide a single user experience across Angular
  and React surfaces.
- Large datasets use CDK virtual scroll.
- XLSX generation runs in a Web Worker to avoid blocking the UI thread.
- Docker Compose provides a local environment close to the intended split
  runtime topology.

## CI/CD

`.gitlab-ci.yml` defines separate install, build, test, docker, and deploy
stages per project. Build and test stages are executable. Docker and deployment
jobs are intentionally mocked for the evaluation environment and document where
production would invoke registry publishing and cluster deployment.

## Production Hardening Areas

- Replace local CORS origins with environment-specific values.
- Add backend session cookie flags: `HttpOnly`, `Secure`, and `SameSite`.
- Promote Docker mock jobs to real image publishing.
- Add end-to-end tests against the composed stack.
- Add performance budgets and Lighthouse CI thresholds.
