// Punto de entrada de la aplicación Shell
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppModule } from './app/app.module';

// Registrar datos de localización española para pipes de número/fecha/moneda
registerLocaleData(localeEs, 'es-ES');

platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZoneEventCoalescing: true })
  .catch((err) => console.error(err));
