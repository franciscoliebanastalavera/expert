import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import { CapHeaderComponent, NavItem } from '@capitalflow/shared-ui';
import { ThemeService } from './core/services/theme.service';
import {
  AppLanguage,
  LANGUAGE_STORAGE_KEY,
  resolveInitialLanguage,
} from './language.constants';
import { AppRoute, toRouteLink } from './routes.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, CapHeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly idiomaActual = signal<AppLanguage>(resolveInitialLanguage());
  menuAbierto = false;

  readonly navItems = toSignal(
    combineLatest([
      this.translate.stream('NAV.HOME'),
      this.translate.stream('NAV.TRANSACTIONS'),
      this.translate.stream('NAV.ANALYTICS'),
      this.translate.stream('NAV.PAYMENTS'),
    ]).pipe(
      map(([home, transactions, analytics, payments]): NavItem[] => [
        { label: home as string, route: toRouteLink(AppRoute.Home) },
        { label: transactions as string, route: toRouteLink(AppRoute.Analytics) },
        { label: analytics as string, route: toRouteLink(AppRoute.AnalyticsMfe) },
        { label: payments as string, route: toRouteLink(AppRoute.PaymentsMfe) },
      ])
    ),
    { initialValue: [] as NavItem[] }
  );

  constructor() {
    const initial = this.idiomaActual();
    this.translate.setDefaultLang(initial);
    this.translate.use(initial);
    this.document.documentElement.lang = initial;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cambiarIdioma(lang?: AppLanguage): void {
    const next: AppLanguage =
      lang ?? (this.idiomaActual() === AppLanguage.Es ? AppLanguage.En : AppLanguage.Es);
    this.translate.use(next);
    this.document.documentElement.lang = next;
    this.idiomaActual.set(next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    }
  }
}
