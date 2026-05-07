# CapitalFlow State

HEAD: eb8326a

Commit count from 517f948: 85

## Closed blocks

- eb8326a feat(shell): proxy mfes under same origin via /remotes/* paths (Vía C — webpack-dev-server proxyConfig + shell nginx `location ^~ /remotes/{mfe}/ proxy_pass`, RemoteMfeConfig.proxyPath, mfe-wrapper-base signals-only with loadOutsideAngular$, plain `new Worker` over same-origin, exceljs label "Generando Excel...", start.ps1 polls 8084, mfe-transactions package-lock.json regenerated, shared-ui Introduction.mdx donut+trend cards)
- d9a1a5a refactor(mfe): signals-only wrapper and remove manual cd across stack (cdr.detectChanges removed from mfe-wrapper-base, NgZone moved to wrap loadRemoteModule via runOutsideAngular, cap-input ngAfterViewInit afterNextRender, export.service timer-based toast auto-dismiss)
- 06d7f43 refactor(mfe-payments): align ngzone setup with transactions and shell (NoopNgZone provider removed; default real NgZone aligned with shell + mfe-transactions)
- d5ca2a2 fix(mfe): clean ngzone integration with shell and auto-dismiss export toast (NgZone runOutsideAngular at createAndAppend, payments-wrapper override deduped, exportPhase setTimeout idle reset)
- c0e87b5 fix(mfe-transactions): use module worker so xlsx export survives module federation
- 8411764 fix(mfe-transactions): use real ngzone so cd works in shell-hosted module federation (NoopNgZone reverted, zone.js polyfill restored, cap-input writeValue without markForCheck)
- 3bcbb58 fix(export): bundle exceljs eagerly into the worker so dev mode resolves it without lazy chunks
- 47af993 revert(export): restore per-cell styling for xlsx since conditional formatting broke writeBuffer
- 757ef81 fix(export): swap to conditional formatting for fast styled xlsx and reset cap-input on writeValue
- 189a2e5 feat(export): polish xlsx export with brand title, header fill, status badges and frozen panes
- 33c0229 fix(storybook): serve shared-ui assets at /assets so cap-icon sprite resolves
- 2f15f42 feat(dev): standalone local launcher scripts without docker (start-local.ps1 + stop-local.ps1, port pre-flight + 180s polling + tree-kill, .local-dev.pids gitignored)
- 62ac494 docs: document standalone local development workflow per project (Bloque 3 — README compatibility matrix + MFE wrapper notes)
- 6edbdd4 fix(storybook): resolve broken asset paths in stories (Bloque 2 — 13 missing SVGs created in shared-ui/src/assets/images, cap-card switched to images/fondoCap.svg)
- e841455 refactor(shared-ui): remove legacy ngmodules and migrate remaining declarations to standalone (Bloque 1 — 24 NgModules eliminated: 19 shims + 4 declaration modules + 1 hub; 5 classes migrated to standalone)
- c2f08b3 style(shared-ui): cap-stat-card value font-size 1.3rem to 1rem
- 6a3ef18 refactor(shell): remove remote-entry url debug line from mfe wrappers spinner
- b63975e fix(mfe-analytics): copy shared-ui into docker build context for tokens import
- edd3c15 refactor: migrate to signal-based inputs, outputs and queries (Batch 5)
- 8cad297 refactor: migrate templates to angular 17 native control flow (Batch 4)
- 570d694 refactor(shared-ui): apply OnPush change detection to remaining components (Batch 3)
- 9bfcc20 refactor: replace ngOnDestroy with DestroyRef.onDestroy across components (Batch 2)
- 5fb74ce refactor(shared-ui): migrate cap-form-controls to takeUntilDestroyed (Batch 1)
- 7f5a3a3 feat(ci): playwright e2e suite, nginx security headers, ci mock annotations
