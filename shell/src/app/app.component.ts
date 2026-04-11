import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  private readonly translate = inject(TranslateService);

  idiomaActual: 'es' | 'en' = 'es';

  constructor() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  cambiarIdioma(): void {
    this.idiomaActual = this.idiomaActual === 'es' ? 'en' : 'es';
    this.translate.use(this.idiomaActual);
  }
}
