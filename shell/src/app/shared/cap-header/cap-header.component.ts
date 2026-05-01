import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppLanguage } from '../../language.constants';
import { IconComponent } from '../../shared/icon/icon.component';
import { IconName } from '../../shared/icon/icon.constants';

export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

const DEFAULT_BRAND_NAME = 'CapitalFlow';
const DEFAULT_BRAND_LOGO = '/assets/svgs/brand-logo.svg';

@Component({
  selector: 'cap-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-header.component.html',
  styleUrls: ['./cap-header.component.scss'],
})
export class CapHeaderComponent {
  readonly brandName = input<string>(DEFAULT_BRAND_NAME);
  readonly brandIcon = input<string>(DEFAULT_BRAND_LOGO);
  readonly navItems = input<NavItem[]>([]);
  readonly showThemeToggle = input<boolean>(true);
  readonly showLangSelector = input<boolean>(true);
  readonly currentLang = input<AppLanguage>(AppLanguage.Es);
  readonly isDark = input<boolean>(false);

  readonly themeToggle = output<void>();
  readonly langChange = output<AppLanguage>();

  readonly appLanguage = AppLanguage;
  readonly iconName = IconName;

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
