import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isSupportedLanguage,
  resolveInitialLanguage,
} from './language.constants';

describe('language.constants', () => {
  describe('isSupportedLanguage', () => {
    it('returns true for the Spanish code', () => {
      expect(isSupportedLanguage('es')).toBeTrue();
    });

    it('returns true for the English code', () => {
      expect(isSupportedLanguage('en')).toBeTrue();
    });

    it('returns false for an unsupported code', () => {
      expect(isSupportedLanguage('fr')).toBeFalse();
      expect(isSupportedLanguage('zh-CN')).toBeFalse();
    });

    it('returns false for null', () => {
      expect(isSupportedLanguage(null)).toBeFalse();
    });

    it('returns false for undefined', () => {
      expect(isSupportedLanguage(undefined)).toBeFalse();
    });

    it('returns false for empty string', () => {
      expect(isSupportedLanguage('')).toBeFalse();
    });
  });

  describe('resolveInitialLanguage', () => {
    afterEach(() => {
      try {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      } catch {
        /* localStorage may have been mocked or stubbed */
      }
    });

    it('returns DEFAULT_LANGUAGE (English) when localStorage has no entry', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(resolveInitialLanguage()).toBe(DEFAULT_LANGUAGE);
      expect(DEFAULT_LANGUAGE).toBe(AppLanguage.En);
    });

    it('returns the stored value when localStorage holds a supported language', () => {
      spyOn(localStorage, 'getItem').and.returnValue('es');
      expect(resolveInitialLanguage()).toBe(AppLanguage.Es);
    });

    it('returns DEFAULT_LANGUAGE when localStorage holds an unsupported value', () => {
      spyOn(localStorage, 'getItem').and.returnValue('fr');
      expect(resolveInitialLanguage()).toBe(DEFAULT_LANGUAGE);
    });

    it('reads from the LANGUAGE_STORAGE_KEY entry', () => {
      const spy = spyOn(localStorage, 'getItem').and.returnValue('en');
      resolveInitialLanguage();
      expect(spy).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY);
    });
  });
});
