import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncludesPipe } from './includes.pipe';
import { IbanPipe } from './iban.pipe';

@NgModule({
  declarations: [IncludesPipe, IbanPipe],
  imports: [CommonModule],
  exports: [IncludesPipe, IbanPipe],
})
export class PipesModule {}
