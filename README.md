# CapitalFlow

CapitalFlow is a practical Angular Expert evaluation project for a B2B financial
platform. The repository demonstrates an incremental migration from a fragile
front-end monolith to a micro-frontend architecture with shared UI, security
hardening, performance controls, automated tests, and Docker-based local
deployment.

## Current Stack

- Shell: Angular 18 standalone application, Module Federation host, OnPush, Signals.
- Transactions MFE: Angular 18 remote exposed as a Web Component (transactions domain — virtual scroll grid, filters, XLSX export worker).
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
| mfe-transactions | http://localhost:8084 | Angular 18 transactions remote |
| storybook | http://localhost:6007 | Shared UI documentation |

## Local development without Docker

Each project can be run standalone with npm scripts. Run them in separate terminals.

### Run all projects locally

One-command launcher (Windows PowerShell):

```powershell
.\start-local.ps1   # arranca los 5 proyectos en ventanas separadas, espera readiness y abre navegadores
.\stop-local.ps1    # mata los procesos y libera puertos 4200/4201/4202/4203/6006
```

Or run them manually in separate terminals:

| Project | Port | Command | URL |
| --- | --- | --- | --- |
| shell | 4200 | `cd shell && npm run start` | http://localhost:4200 |
| mfe-analytics-react | 4201 | `cd mfe-analytics-react && npm run start` | http://localhost:4201 |
| mfe-payments | 4202 | `cd mfe-payments && npm run start` | http://localhost:4202 |
| mfe-transactions | 4203 | `cd mfe-transactions && npm run start` | http://localhost:4203 |
| shared-ui Storybook | 6006 | `cd shared-ui && npm run storybook` | http://localhost:6006 |

### Compatibility matrix: which services to run for what

| To validate | Services needed |
| --- | --- |
| Shell home, /admin/* security demos, /design-system | shell only |
| /transactions (Angular 18 MFE) | shell + mfe-transactions |
| /analytics (React MFE) | shell + mfe-analytics-react |
| /payments (Angular 17 MFE) | shell + mfe-payments |
| All MFE integration | all 4 |
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

cd ../mfe-transactions
npm test

cd ../mfe-payments
npm test

cd ../mfe-analytics-react
npm test -- --runInBand
```

Latest verified local result:

| Project | Test runner | Count |
| --- | --- | --- |
| shell | Karma/Jasmine | 94 passing |
| shared-ui | Karma/Jasmine | 150 passing |
| mfe-transactions | Karma/Jasmine | 46 passing |
| mfe-payments | Karma/Jasmine | 25 passing |
| mfe-analytics-react | Jest | 26 passing |

## Monorepo Layout

```text
expert/
  shell/
    src/app/
      admin/                    Security audit demos
      analytics-wrapper/        React MFE host wrapper
      payments-wrapper/         Angular 17 MFE host wrapper
      transactions-wrapper/     Angular 18 MFE host wrapper
      core/                     Models and shared services
                                  (MfeWrapperBaseComponent, RemoteMfeLoaderService)
    Dockerfile
    nginx.conf
    webpack.config.js

  mfe-transactions/
    src/
      bootstrap.ts             Registers <mfe-transactions>
      app/
        components/            transactions-stats, transactions-table
        services/              transactions, export, transactions-metrics
        models/                transaction, transaction-status-kind, transactions
        utils/                 format-amount
        workers/               XLSX export worker
    Dockerfile
    nginx.conf
    webpack.config.js

  mfe-analytics-react/
    src/
      App.tsx
      web-component.tsx        Registers <mfe-analytics>
    Dockerfile
    nginx.conf
    webpack.config.js

  mfe-payments/
    src/
      bootstrap.ts             Registers <mfe-payments>
    Dockerfile
    nginx.conf
    webpack.config.js

  shared-ui/
    src/lib/                   CapitalFlow component library
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

`shared-ui` contains the CapitalFlow Angular design-system implementation:
19 standalone components (button, alert, info-card, header, footer, modal,
input, tabs, tab, table, data-grid, status-badge, spinner, stat-card,
metric-card, tooltip, icon, donut-chart, trend-chart), 2 pipes (`iban`,
`safeHtml`), 2 directives (`appClickOutside`, `capCellTemplate`) and a
`DynamicCssService` helper.

Storybook is available through Docker at:

```text
http://localhost:6007
```

### Library philosophy

The library adapts to the application, not the other way around. Operating
rules applied during the consolidation pass (Batches 0-6):

1. App component duplicated in the library → modify library to match the app
   visual identity, then replace the local copy.
2. Library component never used → integrate it where it fits without visual
   change, otherwise delete it.
3. App native HTML where the library has an equivalent → tune the library
   variant to match, then replace the native markup.
4. Custom app component without library equivalent → add it to the library
   only if it is genuinely reusable.

Concrete results of that pass: `cap-input` gained a `minimal` variant plus
`size` and `fontFamily` knobs to fit the search, PDF and transactions
filter inputs without changing pixels; `cap-tabs` gained a `card` variant
and originally backed the home dashboard tabs; `cap-footer` is wired to
the global layout; the `iban` pipe gained a no-control overload and
replaced an inline grouping helper; the `safeHtml` pipe replaced a manual
`DomSanitizer` call in the WYSIWYG editor; five unused components, the
legacy `modal/`, and the dead `includes` pipe were removed; two custom SVG
charts (`cap-donut-chart`, `cap-trend-chart`) were added to power the
redesigned home dashboard, which now exposes KPIs, monthly trend and
expense breakdown plus quick-access cards instead of a local operations
table; the operations domain itself was extracted into a dedicated
Angular 18 MFE (`mfe-transactions`).

`cap-tooltip`, `cap-modal`, the `appClickOutside` directive and
`DynamicCssService` are kept as static dependencies of `cap-input`'s
standard variant. They are infrastructure for the rich form fields the
financial workflows will require.

### Library entry points

The library ships two TypeScript entry files that look identical but serve
different consumers:

| Entry | Used by | Resolution |
| --- | --- | --- |
| `public-api.ts` | ng-packagr (APF build, npm publish) | full inventory |
| `public-api-source.ts` | shell + payments + transactions via path mapping | slim inventory |

Path mapping is configured in `shell/tsconfig.json`:

```text
@capitalflow/shared-ui          -> ../shared-ui/src/public-api-source.ts
@capitalflow/shared-ui/lib/*    -> ../shared-ui/src/lib/*
```

The slim entry exists to keep eager re-exports out of the shell's initial
chunk. Pieces that pull heavyweight side-effect dependencies (for example
`SafeHtmlPipe`, which loads DOMPurify at module init) are consumed via the
deep `@capitalflow/shared-ui/lib/...` form so they live inside the lazy
chunk that uses them.

### Worker isolation rule

The XLSX export worker now lives inside `mfe-transactions`. When a project
adds web workers via Angular CLI, its `tsconfig.worker.json` compiles
`*.worker.ts` with `lib: ["ES2022", "webworker"]` (no DOM types). Workers
must import their types via direct file paths, not via index aggregators,
otherwise the program graph reaches `cap-header` and similar DOM-bound
components and fails compilation with `Cannot find name 'HTMLElement'`.
Example from `mfe-transactions/src/app/workers/export.worker.ts`:

```ts
import type { Transaction } from '../models/transaction.model';
```

## Architecture Notes

- The shell owns routing, global layout, language selection, theme state, and
  remote loading. It hosts a redesigned home dashboard (KPIs, donut and
  trend charts, quick-access cards) and the security demo area; every other
  domain lives in its own MFE.
- Angular and React MFEs are integrated through Web Components so teams can
  keep their framework choices without blocking each other. The transactions
  domain (Angular 18), payments (Angular 17) and analytics (React 18) all
  load via Module Federation through the same shell-side wrapper pattern
  (`MfeWrapperBaseComponent` in `shell/src/app/core/components/mfe-wrapper`).
- Shared UI and design tokens provide a single user experience across Angular
  and React surfaces.
- Large datasets use CDK virtual scroll inside `mfe-transactions`.
- XLSX generation runs in a Web Worker inside `mfe-transactions` to avoid
  blocking the UI thread.
- All new and modified SCSS uses `rem` (1rem = 16px), with the only
  exceptions being 1px borders, the literal `0`, and viewport units.
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
