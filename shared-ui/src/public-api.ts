/**
 * Punto de entrada público de la biblioteca @capitalflow/shared-ui.
 * Exporta todos los módulos, componentes, pipes, directivas y servicios.
 */

// Módulo raíz
export * from './lib/shared-ui.module';

// === COMPONENTES ORIGINALES ===

// DataGrid — tabla con virtual scroll (CDK)
export * from './lib/data-grid/data-grid.component';
export * from './lib/data-grid/data-grid.module';

// Modal — diálogo accesible con trap focus (CDK)
export * from './lib/modal/modal.component';
export * from './lib/modal/modal.module';

// SafeHtml — pipe para sanitizar HTML con DOMPurify
export * from './lib/safe-html/safe-html.pipe';
export * from './lib/safe-html/safe-html.module';

// === COMPONENTES ADAPTADOS DE NTER-LIB ===

// Cap-Button — botón con variantes y theming
export * from './lib/cap-button/cap-button.component';
export * from './lib/cap-button/cap-button.module';

// Cap-Modal — modal con backdrop y botones integrados
export * from './lib/cap-modal/cap-modal.component';
export * from './lib/cap-modal/cap-modal.module';

// Cap-Input — input con validación, IBAN y password
export * from './lib/cap-input/cap-input.component';
export * from './lib/cap-input/cap-input.module';

// Cap-Card — tarjeta con theming dinámico
export * from './lib/cap-card/cap-card.component';
export * from './lib/cap-card/cap-card.module';

// Cap-Tabs — pestañas con contenido dinámico
export * from './lib/cap-tabs/cap-tabs.component';
export * from './lib/cap-tabs/cap-tab/cap-tab.component';
export * from './lib/cap-tabs/cap-tabs.module';

// Cap-Tooltip — tooltip con modal responsive
export * from './lib/cap-tooltip/cap-tooltip.component';
export * from './lib/cap-tooltip/cap-tooltip.module';

// Cap-Select — selector con opciones y búsqueda
export * from './lib/cap-select/cap-select.component';
export * from './lib/cap-select/cap-select.module';

// Cap-Checkbox — checkbox con label y descripción
export * from './lib/cap-checkbox/cap-checkbox.component';
export * from './lib/cap-checkbox/cap-checkbox.module';

// Cap-Datepicker — selector de fecha
export * from './lib/cap-datepicker/cap-datepicker.component';
export * from './lib/cap-datepicker/cap-datepicker.module';

// Cap-Switch — interruptor on/off
export * from './lib/cap-switch/cap-switch.component';
export * from './lib/cap-switch/cap-switch.module';

// === CORE: PIPES ===
export * from './lib/core/pipes/iban.pipe';
export * from './lib/core/pipes/includes.pipe';
export * from './lib/core/pipes/pipes.module';

// === CORE: DIRECTIVAS ===
export * from './lib/core/directives/click-outside.directive';
export * from './lib/core/directives/directives.module';

// === CORE: MODELOS Y TIPOS ===
export * from './lib/core/models/components.models';
export * from './lib/core/types/components.types';

// === SERVICIOS ===
export * from './lib/services/dynamic-css.service';
export * from './lib/services/dynamic-css.const';
