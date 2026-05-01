import { NgModule } from '@angular/core';
import { CapTableComponent } from './cap-table.component';
import { CapCellTemplateDirective } from './cap-cell-template.directive';

@NgModule({
  imports: [CapTableComponent, CapCellTemplateDirective],
  exports: [CapTableComponent, CapCellTemplateDirective],
})
export class CapTableModule {}
