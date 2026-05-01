import { NgModule } from '@angular/core';
import { CapDataGridComponent } from './cap-data-grid.component';
import { CapCellTemplateDirective } from '../cap-table/cap-cell-template.directive';

@NgModule({
  imports: [CapDataGridComponent, CapCellTemplateDirective],
  exports: [CapDataGridComponent, CapCellTemplateDirective],
})
export class CapDataGridModule {}
