import { of, Observable } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

export class TranslateServiceMock {
  readonly currentLang = 'es';
  readonly defaultLang = 'es';
  readonly onLangChange = of({ lang: 'es', translations: {} });
  readonly onTranslationChange = of({ lang: 'es', translations: {} });
  readonly onDefaultLangChange = of({ lang: 'es' });

  setDefaultLang(_lang: string): void {
    /* noop */
  }
  use(_lang: string): Observable<unknown> {
    return of({});
  }
  get(key: string | string[]): Observable<string | Record<string, string>> {
    return of(typeof key === 'string' ? key : Object.fromEntries(key.map((k) => [k, k])));
  }
  instant(key: string | string[]): string | Record<string, string> {
    return typeof key === 'string' ? key : Object.fromEntries(key.map((k) => [k, k]));
  }
  stream(key: string): Observable<string> {
    return of(key);
  }
  getParsedResult(_translations: unknown, key: string | string[]): string | Record<string, string> {
    return typeof key === 'string' ? key : Object.fromEntries(key.map((k) => [k, k]));
  }
}

export class RouterMock {
  readonly events = of();
  readonly url = '/';
  navigate = jasmine.createSpy('navigate').and.resolveTo(true);
  navigateByUrl = jasmine.createSpy('navigateByUrl').and.resolveTo(true);
  createUrlTree = jasmine.createSpy('createUrlTree').and.returnValue({});
  serializeUrl = jasmine.createSpy('serializeUrl').and.returnValue('');
}

export class ActivatedRouteMock {
  readonly params = of({});
  readonly queryParams = of({});
  readonly data = of({});
  readonly snapshot = { params: {}, queryParams: {}, data: {} };
}

export class TitleStrategyMock {
  updateTitle = jasmine.createSpy('updateTitle');
  getResolvedTitleForRoute = jasmine.createSpy('getResolvedTitleForRoute').and.returnValue('');
}

export function createSignalSpy<T>(initial: T): {
  signal: WritableSignal<T>;
  set: jasmine.Spy<(value: T) => void>;
} {
  const sig = signal(initial);
  const set = jasmine.createSpy('signal.set').and.callFake((value: T) => sig.set(value));
  return { signal: sig, set };
}
