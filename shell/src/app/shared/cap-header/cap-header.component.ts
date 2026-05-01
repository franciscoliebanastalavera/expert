import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppLanguage } from '../../language.constants';

export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

const DEFAULT_BRAND_NAME = 'CapitalFlow';

@Component({
  selector: 'cap-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-header.component.html',
  styleUrls: ['./cap-header.component.scss'],
})
export class CapHeaderComponent {
  readonly brandName = input<string>(DEFAULT_BRAND_NAME);
  readonly brandIcon = input<string>('');
  readonly navItems = input<NavItem[]>([]);
  readonly showThemeToggle = input<boolean>(true);
  readonly showLangSelector = input<boolean>(true);
  readonly currentLang = input<AppLanguage>(AppLanguage.Es);
  readonly isDark = input<boolean>(false);

  readonly themeToggle = output<void>();
  readonly langChange = output<AppLanguage>();

  readonly appLanguage = AppLanguage;

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onLangChange(): void {
    const next: AppLanguage =
      this.currentLang() === AppLanguage.Es ? AppLanguage.En : AppLanguage.Es;
    this.langChange.emit(next);
  }

  isActiveRouteExact(route: string): boolean {
    return route === '/';
  }
}
