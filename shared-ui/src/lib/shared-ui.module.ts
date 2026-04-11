import { NgModule } from '@angular/core';

import { DataGridModule } from './data-grid/data-grid.module';
import { ModalModule } from './modal/modal.module';
import { SafeHtmlModule } from './safe-html/safe-html.module';

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
import { CapFooterModule } from './cap-footer/cap-footer.module';
import { CapHeaderModule } from './cap-header/cap-header.module';

import { PipesModule } from './core/pipes/pipes.module';
import { DirectivesModule } from './core/directives/directives.module';

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
    CapFooterModule,
    CapHeaderModule,
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
    CapFooterModule,
    CapHeaderModule,
    PipesModule,
    DirectivesModule,
  ],
})
export class SharedUiModule {}
