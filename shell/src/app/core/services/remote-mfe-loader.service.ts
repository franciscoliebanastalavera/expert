import { inject, Injectable, InjectionToken } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { catchError, forkJoin, from, map, Observable, of, timeout, timer, TimeoutError } from 'rxjs';
import {
  REMOTE_MFE_PORTS,
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
    const { protocol, hostname, port } = window.location;
    const shellPort =
      Number(port) ||
      (protocol === REMOTE_MFE_PORTS.httpsProtocol ? REMOTE_MFE_PORTS.https : REMOTE_MFE_PORTS.http);
    const mfePort = shellPort + config.portOffset;
    return `${protocol}//${hostname}:${mfePort}${config.remoteEntryPath}`;
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
