import { NgModule } from '@angular/core';

import { DataGridModule } from './data-grid/data-grid.module';
import { ModalModule } from './modal/modal.module';
import { SafeHtmlModule } from './safe-html/safe-html.module';

/**
 * Modulo raiz de la biblioteca shared-ui.
 * Importa y re-exporta todos los submodulos para facilitar el consumo.
 */
@NgModule({
  imports: [DataGridModule, ModalModule, SafeHtmlModule],
  exports: [DataGridModule, ModalModule, SafeHtmlModule],
})
export class SharedUiModule {}
