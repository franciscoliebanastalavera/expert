/**
 * Punto de entrada publico de la biblioteca @capitalflow/shared-ui.
 * Exporta todos los modulos y componentes disponibles.
 */

// Modulo raiz que agrupa todos los submodulos
export * from './lib/shared-ui.module';

// DataGrid - componente de tabla con virtual scroll
export * from './lib/data-grid/data-grid.component';
export * from './lib/data-grid/data-grid.module';

// Modal - dialogo accesible con trap focus
export * from './lib/modal/modal.component';
export * from './lib/modal/modal.module';

// SafeHtml - pipe para sanitizar HTML con DOMPurify
export * from './lib/safe-html/safe-html.pipe';
export * from './lib/safe-html/safe-html.module';
