import { NgModule } from '@angular/core';
import { CapDatepickerComponent } from './cap-datepicker.component';

/**
 * Modulo wrapper para el componente CapDatepickerComponent.
 * Permite su uso tanto en modulos standalone como en modulos tradicionales.
 */
@NgModule({
  imports: [CapDatepickerComponent],
  exports: [CapDatepickerComponent],
})
export class CapDatepickerModule {}
