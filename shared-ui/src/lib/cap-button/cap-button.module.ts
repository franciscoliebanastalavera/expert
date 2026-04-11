import { NgModule } from '@angular/core';
import { CapButtonComponent } from './cap-button.component';

/**
 * Modulo wrapper para el componente CapButtonComponent.
 * Permite su uso tanto en modulos standalone como en modulos tradicionales.
 */
@NgModule({
  imports: [CapButtonComponent],
  exports: [CapButtonComponent],
})
export class CapButtonModule {}
