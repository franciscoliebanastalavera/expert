import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';

// Componente raíz del Shell — navegación, selector de idioma y toggle de tema
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  idiomaActual: 'es' | 'en' = 'es';

  constructor(
    public readonly themeService: ThemeService,
    private readonly translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  /** Alterna entre español e inglés */
  cambiarIdioma(): void {
    this.idiomaActual = this.idiomaActual === 'es' ? 'en' : 'es';
    this.translate.use(this.idiomaActual);
  }
}
