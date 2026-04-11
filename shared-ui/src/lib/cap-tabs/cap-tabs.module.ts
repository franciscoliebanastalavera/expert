import { NgModule } from '@angular/core';
import { CapTabsComponent } from './cap-tabs.component';
import { CapTabComponent } from './cap-tab/cap-tab.component';

@NgModule({
  imports: [CapTabsComponent, CapTabComponent],
  exports: [CapTabsComponent, CapTabComponent],
})
export class CapTabsModule {}
