import { NgModule } from '@angular/core';

// Módulos originales
import { DataGridModule } from './data-grid/data-grid.module';
import { ModalModule } from './modal/modal.module';
import { SafeHtmlModule } from './safe-html/safe-html.module';

// Módulos adaptados de Nter-lib
import { CapButtonModule } from './cap-button/cap-button.module';
import { CapModalModule } from './cap-modal/cap-modal.module';
import { CapInputModule } from './cap-input/cap-input.module';
import { CapCardModule } from './cap-card/cap-card.module';
import { CapTabsModule } from './cap-tabs/cap-tabs.module';
import { CapTooltipModule } from './cap-tooltip/cap-tooltip.module';
import { CapSelectModule } from './cap-select/cap-select.module';
import { CapCheckboxModule } from './cap-checkbox/cap-checkbox.module';
import { CapDatepickerModule } from './cap-datepicker/cap-datepicker.module';
import { CapSwitchModule } from './cap-switch/cap-switch.module';

// Core
import { PipesModule } from './core/pipes/pipes.module';
import { DirectivesModule } from './core/directives/directives.module';

/**
 * Módulo raíz de la biblioteca shared-ui.
 * Importa y re-exporta todos los submódulos para facilitar el consumo.
 */
@NgModule({
  imports: [
    DataGridModule,
    ModalModule,
    SafeHtmlModule,
    CapButtonModule,
    CapModalModule,
    CapInputModule,
    CapCardModule,
    CapTabsModule,
    CapTooltipModule,
    CapSelectModule,
    CapCheckboxModule,
    CapDatepickerModule,
    CapSwitchModule,
    PipesModule,
    DirectivesModule,
  ],
  exports: [
    DataGridModule,
    ModalModule,
    SafeHtmlModule,
    CapButtonModule,
    CapModalModule,
    CapInputModule,
    CapCardModule,
    CapTabsModule,
    CapTooltipModule,
    CapSelectModule,
    CapCheckboxModule,
    CapDatepickerModule,
    CapSwitchModule,
    PipesModule,
    DirectivesModule,
  ],
})
export class SharedUiModule {}
