import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  forwardRef,
  input,
  output,
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
  readonly tabAlignment = input<AlignVariant>('left');
  readonly tabMobile = input(false);
  readonly variant = input<'underline' | 'card'>('underline');
  readonly tabsChange = output<string>();

  readonly tabs = contentChildren(CapTabComponent);

  ngAfterContentInit() {
    const tabs = this.tabs();
    const activeTabs = tabs.filter((tab) => tab.active());
    if (activeTabs.length === 0) {
      this.selectTab(tabs[0]);
    } else {
      this.getActiveTab();
    }
  }

  selectTab(tab: CapTabComponent) {
    if (tab.disabled() === true) {
      return;
    }
    this.tabs().forEach((tab) => tab.active.set(false));
    tab.active.set(true);
    this.getActiveTab();
  }

  getActiveTab(): void {
    const activeTab = this.tabs().find((tab) => tab.active() === true)?.label();
    if (activeTab !== undefined) {
      this.tabsChange.emit(activeTab);
    }
  }
}
