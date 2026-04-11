import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './click-outside.directive';

// Módulo de directivas reutilizables — adaptado de Nter-lib
@NgModule({
  declarations: [ClickOutsideDirective],
  imports: [CommonModule],
  exports: [ClickOutsideDirective],
})
export class DirectivesModule {}
