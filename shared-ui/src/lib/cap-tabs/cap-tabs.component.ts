import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AlignVariant } from '../core/types/components.types';
import { CapTabComponent } from './cap-tab/cap-tab.component';

@Component({
  selector: 'cap-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-tabs.component.html',
  styleUrl: './cap-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapTabsComponent),
      multi: true,
    },
  ],
})
export class CapTabsComponent implements AfterContentInit {
  @Input() tabAlignment: AlignVariant = 'left';

  @Input() tabMobile = false;

  @Output() tabsChange = new EventEmitter<string>();

  @ContentChildren(CapTabComponent) tabs: QueryList<CapTabComponent>;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    } else {
      this.getActiveTab();
    }
  }

  selectTab(tab: CapTabComponent) {
    if (tab.disabled === true) {
      return;
    }
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    tab.active = true;
    this.getActiveTab();
  }

  getActiveTab(): void {
    const even = (element) => element.active === true;
    const activeTab = this.tabs.toArray().find(even).label;
    this.tabsChange.emit(activeTab);
  }
}
