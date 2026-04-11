import { NgModule } from '@angular/core';
import { CapCheckboxComponent } from './cap-checkbox.component';

/**
 * Modulo wrapper para el componente CapCheckboxComponent.
 * Permite su uso tanto en modulos standalone como en modulos tradicionales.
 */
@NgModule({
  imports: [CapCheckboxComponent],
  exports: [CapCheckboxComponent],
})
export class CapCheckboxModule {}
