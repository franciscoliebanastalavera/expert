export const AppLanguage = {
  Es: 'es',
  En: 'en',
} as const;

export type AppLanguage = (typeof AppLanguage)[keyof typeof AppLanguage];

export const DEFAULT_LANGUAGE: AppLanguage = AppLanguage.Es;

export const APP_LOCALE_ID = 'es-ES';
export const I18N_ASSETS_PATH = './assets/i18n/';
export const I18N_ASSETS_EXTENSION = '.json';
