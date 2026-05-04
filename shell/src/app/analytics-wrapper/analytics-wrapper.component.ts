import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { CapSpinnerComponent } from '@capitalflow/shared-ui';
import { catchError, EMPTY, forkJoin, from, map, Observable, of, switchMap, tap, timer } from 'rxjs';
import {
  ANALYTICS_REMOTE_MFE_CONFIG,
  REMOTE_MFE_PORTS,
  RemoteMfeConfig,
} from '../core/models';

@Component({
  selector: 'app-analytics-wrapper',
  standalone: true,
  imports: [TranslateModule, CapSpinnerComponent],
  templateUrl: './analytics-wrapper.component.html',
  styleUrls: ['./analytics-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnalyticsWrapperComponent implements AfterViewInit, OnDestroy {
  readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = ANALYTICS_REMOTE_MFE_CONFIG;

  readonly cargando = signal(true);
  readonly fadeOut = signal(false);
  readonly error = signal('');

  ngAfterViewInit(): void {
    this.loadMfe(this.config)
      .pipe(
        switchMap((loaded) => {
          if (!loaded) {
            this.showError();
            return EMPTY;
          }
          this.fadeOut.set(true);
          this.cdr.detectChanges();
          return timer(this.config.fadeOutDelayMs).pipe(tap(() => this.appendMfeElement()));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    const el = this.container().nativeElement.querySelector(this.config.elementTag);
    if (el) {
      el.remove();
    }
  }

  private loadMfe(config: RemoteMfeConfig): Observable<boolean> {
    return forkJoin({
      loaded: from(
        loadRemoteModule({
          type: config.remoteType,
          remoteEntry: this.buildMfeRemoteEntry(config),
          remoteName: config.remoteName,
          exposedModule: config.exposedModule,
        })
      ).pipe(
        map(() => true),
        catchError(() => of(false))
      ),
      delay: timer(config.minLoadingDelayMs),
    }).pipe(map(({ loaded }) => loaded));
  }

  private appendMfeElement(): void {
    const analyticsEl = this.document.createElement(this.config.elementTag);
    this.container().nativeElement.appendChild(analyticsEl);
    this.cargando.set(false);
    this.cdr.detectChanges();
  }

  private showError(): void {
    this.cargando.set(false);
    this.error.set(this.config.errorMessage);
    this.cdr.detectChanges();
  }

  private buildMfeRemoteEntry(config: RemoteMfeConfig): string {
    const { protocol, hostname, port } = window.location;
    const shellPort =
      Number(port) ||
      (protocol === REMOTE_MFE_PORTS.httpsProtocol ? REMOTE_MFE_PORTS.https : REMOTE_MFE_PORTS.http);
    const mfePort = shellPort + config.portOffset;
    return `${protocol}//${hostname}:${mfePort}${config.remoteEntryPath}`;
  }
}
