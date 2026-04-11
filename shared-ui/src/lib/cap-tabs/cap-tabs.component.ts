// Componente Tabs — adaptado de Nter-lib
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
  /**
   * Define la disposicion horizontal de las pestanas. Solo se puede elegir: left, center o right.
   */
  @Input() tabAlignment: AlignVariant = 'left';

  /**
   * Version movil opcional de las pestanas
   */
  @Input() tabMobile = false;

  /**
   * Evento emitido con la etiqueta de la pestana activa
   */
  @Output() tabsChange = new EventEmitter<unknown>();

  @ContentChildren(CapTabComponent) tabs: QueryList<CapTabComponent>;

  /** Se establecen los ContentChildren */
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
