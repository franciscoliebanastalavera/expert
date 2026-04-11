import { NgModule } from '@angular/core';
import { CapSwitchComponent } from './cap-switch.component';

/**
 * Modulo wrapper para el componente CapSwitchComponent.
 * Permite su uso tanto en modulos standalone como en modulos tradicionales.
 */
@NgModule({
  imports: [CapSwitchComponent],
  exports: [CapSwitchComponent],
})
export class CapSwitchModule {}
