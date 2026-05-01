import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { APP_LOCALE_ID } from './app/language.constants';

registerLocaleData(localeEs, APP_LOCALE_ID);

bootstrapApplication(AppComponent, appConfig).catch(() => {});
