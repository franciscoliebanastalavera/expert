/* Slim entry point for monorepo source-import (shell/expert).
 * Exports only the standalone components/directives/types the shell consumes.
 * The full library entry remains `public-api.ts` (used by ng-packagr for the published APF build).
 */

export * from './lib/cap-button/cap-button.component';

export * from './lib/cap-status-badge/cap-status-badge.component';

export * from './lib/cap-spinner/cap-spinner.component';

export * from './lib/cap-icon/cap-icon.component';

export * from './lib/cap-stat-card/cap-stat-card.component';

export * from './lib/cap-metric-card/cap-metric-card.component';

export * from './lib/cap-table/cap-table.component';
export * from './lib/cap-table/cap-cell-template.directive';
export * from './lib/cap-table/cap-table.types';

export * from './lib/cap-data-grid/cap-data-grid.component';

export * from './lib/cap-header/cap-header.component';

export * from './lib/cap-alert/cap-alert.component';
export * from './lib/cap-alert/cap-alert.types';

export * from './lib/cap-info-card/cap-info-card.component';

export * from './lib/cap-input/cap-input.component';
