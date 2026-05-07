import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, NEVER } from 'rxjs';
import { REMOTE_MFE_TIMEOUT_MS, RemoteMfeConfig, RemoteMfeLoadResult } from '../models';
import {
  REMOTE_MFE_MODULE_LOADER,
  RemoteMfeLoaderService,
  RemoteMfeModuleLoader,
} from './remote-mfe-loader.service';

const TEST_CONFIG: RemoteMfeConfig = {
  remoteEntryPath: '/remoteEntry.js',
  remoteName: 'mfeLoaderSpec',
  exposedModule: './SpecModule',
  remoteType: 'script',
  elementTag: 'mfe-loader-spec',
  portOffset: 1,
  minLoadingDelayMs: 0,
  fadeOutDelayMs: 0,
  errorMessage: 'Remote failed',
  loadingLabelKey: 'SPEC.LOADING',
  retryLabelKey: 'SPEC.RETRY',
};

describe('RemoteMfeLoaderService', () => {
  let loaderSpy: jasmine.Spy<RemoteMfeModuleLoader>;
  let service: RemoteMfeLoaderService;

  function configure(loader: jasmine.Spy<RemoteMfeModuleLoader>): void {
    TestBed.configureTestingModule({
      providers: [{ provide: REMOTE_MFE_MODULE_LOADER, useValue: loader }],
    });
    service = TestBed.inject(RemoteMfeLoaderService);
  }

  it('returns a success result when the remote module loads', fakeAsync(() => {
    loaderSpy = jasmine.createSpy<RemoteMfeModuleLoader>().and.resolveTo({});
    configure(loaderSpy);
    let result: RemoteMfeLoadResult | undefined;

    firstValueFrom(service.load$(TEST_CONFIG)).then((value) => {
      result = value;
    });
    tick();

    expect(result?.success).toBeTrue();
    expect(result?.attemptedUrl).toContain('/remoteEntry.js');
    expect(loaderSpy).toHaveBeenCalled();
  }));

  it('returns a failure result when the remote module rejects', fakeAsync(() => {
    loaderSpy = jasmine.createSpy<RemoteMfeModuleLoader>().and.rejectWith(new Error('boom'));
    configure(loaderSpy);
    let result: RemoteMfeLoadResult | undefined;

    firstValueFrom(service.load$(TEST_CONFIG)).then((value) => {
      result = value;
    });
    tick();

    expect(result?.success).toBeFalse();
    expect(result?.attemptedUrl).toContain('/remoteEntry.js');
    if (result?.success === false) {
      expect(result.error).toContain('boom');
    }
  }));

  it('returns a timeout failure when the remote module never resolves', fakeAsync(() => {
    loaderSpy = jasmine.createSpy<RemoteMfeModuleLoader>().and.returnValue(firstValueFrom(NEVER));
    configure(loaderSpy);
    let result: RemoteMfeLoadResult | undefined;

    firstValueFrom(service.load$(TEST_CONFIG)).then((value) => {
      result = value;
    });
    tick(REMOTE_MFE_TIMEOUT_MS);

    expect(result?.success).toBeFalse();
    if (result?.success === false) {
      expect(result.error).toContain('timed out');
    }
  }));
});
