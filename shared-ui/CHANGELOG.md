# Changelog

All notable changes to the @capitalflow/shared-ui library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-02

### Added
- 19 reusable cap-* components (button, card, checkbox, datepicker, footer, header, input, modal, select, switch, tabs, data-grid, icon, metric-card, spinner, stat-card, status-badge, table, tooltip).
- Storybook documentation for all 19 components.
- DOMPurify-backed `safeHtml` pipe for sanitised HTML rendering.
- `clickOutside` directive.
- `cap-data-grid` virtual-scroll viewport (CDK) supporting 80 000+ rows without UI freeze.
- Source-import path mapping for consumers (avoids `dist/` EDR locks in regulated environments).

### Notes
- Compatible with Angular 16/17/18 consumers via path mapping to `src/public-api-source.ts`.
- React consumers integrate via shared CSS design tokens (no Web Components yet).
- Build via `ng-packagr`; dev docs via Storybook.
