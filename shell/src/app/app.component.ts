import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly idiomaActual = signal<'es' | 'en'>('es');
  menuAbierto = false;

  readonly navItems = toSignal(
    combineLatest([
      this.translate.stream('NAV.HOME'),
      this.translate.stream('NAV.ANALYTICS'),
    ]).pipe(
      map(([home, analytics]) => [
        { label: home as string, route: '/' },
        { label: analytics as string, route: '/analytics' },
      ]),
    ),
    { initialValue: [] as { label: string; route: string }[] },
  );

  constructor() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.document.documentElement.lang = 'es';
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cambiarIdioma(lang?: 'es' | 'en'): void {
    const next = lang ?? (this.idiomaActual() === 'es' ? 'en' : 'es');
    this.translate.use(next);
    this.document.documentElement.lang = next;
    this.idiomaActual.set(next);
  }
}
