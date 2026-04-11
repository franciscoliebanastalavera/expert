import { NgModule } from '@angular/core';
import { CapModalComponent } from './cap-modal.component';

// Módulo del componente Modal — wrapper NgModule para CapModalComponent standalone
@NgModule({
  imports: [CapModalComponent],
  exports: [CapModalComponent],
})
export class CapModalModule {}
