import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'cap-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-header.component.html',
  styleUrls: ['./cap-header.component.scss'],
})
export class CapHeaderComponent {
  @Input() brandName = 'CapitalFlow';
  @Input() brandIcon = '';
  @Input() navItems: NavItem[] = [];
  @Input() showThemeToggle = true;
  @Input() showLangSelector = true;
  @Input() currentLang: 'es' | 'en' = 'es';
  @Input() isDark = false;

  @Output() themeToggle = new EventEmitter<void>();
  @Output() langChange = new EventEmitter<'es' | 'en'>();

  menuOpen = false;

  onLangChange(): void {
    const next = this.currentLang === 'es' ? 'en' : 'es';
    this.langChange.emit(next);
  }
}
