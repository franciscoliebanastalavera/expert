export const AppLanguage = {
  Es: 'es',
  En: 'en',
} as const;

export type AppLanguage = (typeof AppLanguage)[keyof typeof AppLanguage];

export const DEFAULT_LANGUAGE: AppLanguage = AppLanguage.Es;

export const APP_LOCALE_ID = 'es-ES';
export const I18N_ASSETS_PATH = './assets/i18n/';
export const I18N_ASSETS_EXTENSION = '.json';
export const LANGUAGE_STORAGE_KEY = 'capitalflow-language';

const SUPPORTED_LANGUAGES: readonly AppLanguage[] = [AppLanguage.Es, AppLanguage.En];

export function isSupportedLanguage(lang: string | null | undefined): lang is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as AppLanguage);
}

export function resolveInitialLanguage(): AppLanguage {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(stored)) {
      return stored;
    }
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.split('-')[0];
    if (isSupportedLanguage(browserLang)) {
      return browserLang;
    }
  }
  return DEFAULT_LANGUAGE;
}
