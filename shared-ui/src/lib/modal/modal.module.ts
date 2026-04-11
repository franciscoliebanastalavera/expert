import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';

import { ModalComponent } from './modal.component';

/**
 * Modulo del componente Modal.
 * Importa A11yModule del CDK para habilitar la trampa de foco.
 */
@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, A11yModule],
  exports: [ModalComponent],
})
export class ModalModule {}
