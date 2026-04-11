import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { DataGridComponent } from './data-grid.component';

@NgModule({
  declarations: [DataGridComponent],
  imports: [CommonModule, ScrollingModule],
  exports: [DataGridComponent],
})
export class DataGridModule {}
