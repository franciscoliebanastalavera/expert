import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { CapAlertComponent, CapButtonComponent } from '@capitalflow/shared-ui';
import { TransactionsWrapperComponent } from './transactions-wrapper.component';
import { TranslateServiceMock } from '../../testing/mocks';

const MIN_LOADING_DELAY_MS = 600;
const FADE_OUT_DELAY_MS = 300;
const FULL_DELAY_MS = MIN_LOADING_DELAY_MS + FADE_OUT_DELAY_MS + 50;
const REMOTE_NAME = 'mfeTransactions';

interface FederationGlobals {
  __webpack_init_sharing__?: (scope: string) => Promise<void>;
  __webpack_share_scopes__?: { default: unknown };
  [key: string]: unknown;
}

/**
 * The dynamic-federation runtime caches the container returned by `window[REMOTE_NAME]`
 * inside a module-level `containerMap` keyed by `remoteName`. Because that map is a
 * closure variable, it can't be reset between tests. To stay deterministic regardless
 * of test order (within or across spec files), we install a single shared container on
 * `window` and toggle whether its `get()` method resolves or rejects for each test.
 */
const sharedContainerGet = jasmine.createSpy('container.get');

function getFed(): FederationGlobals {
  return window as unknown as FederationGlobals;
}

function ensureFederationStubs(): void {
  const fed = getFed();
  if (!fed['__webpack_init_sharing__']) {
    fed['__webpack_init_sharing__'] = (): Promise<void> => Promise.resolve();
  }
  if (!fed['__webpack_share_scopes__']) {
    fed['__webpack_share_scopes__'] = { default: {} };
  }
  fed[REMOTE_NAME] = {
    init: (): Promise<void> => Promise.resolve(),
    get: sharedContainerGet,
  };
}

function stubScriptLoading(opts: { failScript: boolean }): { restore: () => void } {
  const originalCreateElement = document.createElement.bind(document);
  const trackedScripts: HTMLScriptElement[] = [];
  const originalAppendChild = document.body.appendChild.bind(document.body);

  const appendChildSpy = spyOn(document.body, 'appendChild').and.callFake(((node: Node): Node => {
    if (trackedScripts.includes(node as HTMLScriptElement)) {
      const scriptEl = node as HTMLScriptElement;
      Promise.resolve().then(() => {
        if (opts.failScript) {
          scriptEl.onerror?.(new Event('error'));
        } else {
          scriptEl.onload?.(new Event('load'));
        }
      });
      return node;
    }
    return originalAppendChild(node);
  }) as typeof document.body.appendChild);

  const createElementSpy = spyOn(document, 'createElement').and.callFake(
    ((tagName: string, options?: ElementCreationOptions): HTMLElement => {
      const el = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'script') {
        trackedScripts.push(el as HTMLScriptElement);
      }
      return el;
    }) as typeof document.createElement
  );

  return {
    restore: (): void => {
      createElementSpy.and.callThrough();
      appendChildSpy.and.callThrough();
    },
  };
}

describe('TransactionsWrapperComponent', () => {
  let fixture: ComponentFixture<TransactionsWrapperComponent>;
  let component: TransactionsWrapperComponent;

  beforeEach(async () => {
    ensureFederationStubs();
    sharedContainerGet.calls.reset();
    sharedContainerGet.and.resolveTo((): Record<string, unknown> => ({}));

    await TestBed.configureTestingModule({
      imports: [TransactionsWrapperComponent],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslateStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsWrapperComponent);
    component = fixture.componentInstance;
  });

  it('starts in the loading state with no error and fadeOut disabled', () => {
    expect(component.cargando()).toBeTrue();
    expect(component.fadeOut()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('exposes cargando, fadeOut and error as signals before init', () => {
    expect(typeof component.cargando).toBe('function');
    expect(typeof component.fadeOut).toBe('function');
    expect(typeof component.error).toBe('function');
  });

  it('appends the mfe-analytics element and clears loading on a successful load', fakeAsync(() => {
    const stubs = stubScriptLoading({ failScript: false });
    try {
      fixture.detectChanges();
      flush();
      tick(FULL_DELAY_MS);
      flush();

      expect(component.cargando()).toBeFalse();
      expect(component.fadeOut()).toBeTrue();
      expect(component.error()).toBe('');
      expect(component.container().nativeElement.querySelector('mfe-transactions')).not.toBeNull();
    } finally {
      stubs.restore();
      discardPeriodicTasks();
    }
  }));

  it('removes the mfe-analytics element when destroyed after a successful load', fakeAsync(() => {
    const stubs = stubScriptLoading({ failScript: false });
    try {
      fixture.detectChanges();
      flush();
      tick(FULL_DELAY_MS);
      flush();
      const containerEl = component.container().nativeElement;
      expect(containerEl.querySelector('mfe-transactions')).not.toBeNull();

      fixture.destroy();
      expect(containerEl.querySelector('mfe-transactions')).toBeNull();
    } finally {
      stubs.restore();
      discardPeriodicTasks();
    }
  }));

  it('sets the error signal and clears loading when the exposed module lookup fails', fakeAsync(() => {
    sharedContainerGet.and.callFake(() => Promise.reject(new Error('boom')));
    const stubs = stubScriptLoading({ failScript: false });
    try {
      fixture.detectChanges();
      flush();
      tick(FULL_DELAY_MS);
      flush();

      expect(component.cargando()).toBeFalse();
      expect(component.error()).toContain('Transacciones');
      expect(component.container().nativeElement.querySelector('mfe-transactions')).toBeNull();
    } finally {
      stubs.restore();
      discardPeriodicTasks();
    }
  }));

  it('shows a diagnostic alert with the attempted remote url when loading fails', fakeAsync(() => {
    sharedContainerGet.and.callFake(() => Promise.reject(new Error('boom')));
    const stubs = stubScriptLoading({ failScript: false });
    try {
      fixture.detectChanges();
      flush();
      tick(FULL_DELAY_MS);
      flush();
      fixture.detectChanges();

      const alert = fixture.debugElement.query(By.directive(CapAlertComponent));
      const retryButton = fixture.debugElement.query(By.directive(CapButtonComponent));
      expect(alert).not.toBeNull();
      expect(retryButton).not.toBeNull();
      expect(component.loadError()).toContain('/remoteEntry.js');
      expect(component.loadError()).toContain('boom');
    } finally {
      stubs.restore();
      discardPeriodicTasks();
    }
  }));

  it('increments attempts and retries the remote load', fakeAsync(() => {
    sharedContainerGet.and.callFake(() => Promise.reject(new Error('boom')));
    const stubs = stubScriptLoading({ failScript: false });
    try {
      fixture.detectChanges();
      flush();
      tick(FULL_DELAY_MS);
      flush();

      component.retryLoad();
      expect(component.loadAttempts()).toBe(1);
      flush();
      tick(FULL_DELAY_MS);
      flush();
      expect(component.loadError()).toContain('/remoteEntry.js');
    } finally {
      stubs.restore();
      discardPeriodicTasks();
    }
  }));

  it('does not throw on destroy when loading failed (no element to remove)', fakeAsync(() => {
    sharedContainerGet.and.callFake(() => Promise.reject(new Error('boom')));
    const stubs = stubScriptLoading({ failScript: false });
    try {
      fixture.detectChanges();
      flush();
      tick(FULL_DELAY_MS);
      flush();
      expect(() => fixture.destroy()).not.toThrow();
    } finally {
      stubs.restore();
      discardPeriodicTasks();
    }
  }));
});
