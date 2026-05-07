import { inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { catchError, forkJoin, from, map, Observable, of, take, timeout, timer, TimeoutError } from 'rxjs';
import {
  REMOTE_MFE_TIMEOUT_MS,
  RemoteMfeConfig,
  RemoteMfeLoadResult,
} from '../models';

export type RemoteMfeModuleLoader = typeof loadRemoteModule;

export const REMOTE_MFE_MODULE_LOADER = new InjectionToken<RemoteMfeModuleLoader>(
  'REMOTE_MFE_MODULE_LOADER',
  {
    providedIn: 'root',
    factory: () => loadRemoteModule,
  },
);

@Injectable({ providedIn: 'root' })
export class RemoteMfeLoaderService {
  private readonly moduleLoader = inject(REMOTE_MFE_MODULE_LOADER);
  private readonly ngZone = inject(NgZone);

  loadOutsideAngular$(config: RemoteMfeConfig): Observable<RemoteMfeLoadResult> {
    return new Observable<RemoteMfeLoadResult>((subscriber) => {
      this.ngZone.runOutsideAngular(() => {
        this.load$(config)
          .pipe(take(1))
          .subscribe({
            next: (result) =>
              this.ngZone.run(() => {
                subscriber.next(result);
                subscriber.complete();
              }),
            error: (error) =>
              this.ngZone.run(() => subscriber.error(error)),
          });
      });
    });
  }

  load$(config: RemoteMfeConfig): Observable<RemoteMfeLoadResult> {
    const attemptedUrl = this.buildRemoteEntryUrl(config);

    return forkJoin({
      loaded: from(
        this.moduleLoader({
          type: config.remoteType,
          remoteEntry: attemptedUrl,
          remoteName: config.remoteName,
          exposedModule: config.exposedModule,
        }),
      ).pipe(timeout(REMOTE_MFE_TIMEOUT_MS)),
      delay: timer(config.minLoadingDelayMs),
    }).pipe(
      map(
        (): RemoteMfeLoadResult => ({
          success: true,
          customElementTag: config.elementTag,
          attemptedUrl,
        }),
      ),
      catchError((error: unknown) =>
        of({
          success: false,
          attemptedUrl,
          error: this.formatError(error),
        } satisfies RemoteMfeLoadResult),
      ),
    );
  }

  buildRemoteEntryUrl(config: RemoteMfeConfig): string {
    return `${config.proxyPath}${config.remoteEntryPath}`;
  }

  private formatError(error: unknown): string {
    if (error instanceof TimeoutError) {
      return `Remote load timed out after ${REMOTE_MFE_TIMEOUT_MS}ms`;
    }
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'Remote load failed';
  }
}
