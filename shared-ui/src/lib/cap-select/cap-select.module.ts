import { NgModule } from '@angular/core';
import { CapSelectComponent } from './cap-select.component';

/**
 * Modulo wrapper para el componente CapSelectComponent.
 * Permite su uso tanto en modulos standalone como en modulos tradicionales.
 */
@NgModule({
  imports: [CapSelectComponent],
  exports: [CapSelectComponent],
})
export class CapSelectModule {}
