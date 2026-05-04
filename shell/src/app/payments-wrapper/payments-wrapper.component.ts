import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent, CapSpinnerComponent } from '@capitalflow/shared-ui';
import { EMPTY, switchMap, tap, timer } from 'rxjs';
import { PAYMENTS_REMOTE_MFE_CONFIG, RemoteMfeLoadResult } from '../core/models';
import { RemoteMfeLoaderService } from '../core/services/remote-mfe-loader.service';

@Component({
  selector: 'app-payments-wrapper',
  standalone: true,
  imports: [TranslateModule, CapAlertComponent, CapButtonComponent, CapSpinnerComponent],
  templateUrl: './payments-wrapper.component.html',
  styleUrls: ['./payments-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentsWrapperComponent implements AfterViewInit, OnDestroy {
  readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly remoteLoader = inject(RemoteMfeLoaderService);
  private readonly config = PAYMENTS_REMOTE_MFE_CONFIG;

  readonly cargando = signal(true);
  readonly fadeOut = signal(false);
  readonly error = signal('');
  readonly loadAttempts = signal(0);
  readonly loadError = signal<string | null>(null);
  readonly attemptedUrl = signal('');

  ngAfterViewInit(): void {
    this.loadRemote();
  }

  ngOnDestroy(): void {
    const el = this.container().nativeElement.querySelector(this.config.elementTag);
    if (el) {
      el.remove();
    }
  }

  retryLoad(): void {
    this.loadAttempts.update((attempts) => attempts + 1);
    this.loadRemote();
  }

  private loadRemote(): void {
    this.cargando.set(true);
    this.fadeOut.set(false);
    this.error.set('');
    this.loadError.set(null);
    this.attemptedUrl.set(this.remoteLoader.buildRemoteEntryUrl(this.config));
    this.cdr.detectChanges();

    this.remoteLoader
      .load$(this.config)
      .pipe(
        switchMap((result) => {
          if (!result.success) {
            this.showError(result);
            return EMPTY;
          }
          this.fadeOut.set(true);
          this.cdr.detectChanges();
          return timer(this.config.fadeOutDelayMs).pipe(tap(() => this.appendMfeElement(result)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private appendMfeElement(result: RemoteMfeLoadResult): void {
    if (!result.success) {
      return;
    }
    const existing = this.container().nativeElement.querySelector(result.customElementTag);
    if (existing) {
      existing.remove();
    }
    this.ngZone.runOutsideAngular(() => {
      const paymentsEl = this.document.createElement(result.customElementTag);
      this.container().nativeElement.appendChild(paymentsEl);
    });
    this.cargando.set(false);
    this.cdr.detectChanges();
  }

  private showError(result: RemoteMfeLoadResult): void {
    if (result.success) {
      return;
    }
    const message = `${result.attemptedUrl} - ${result.error}`;
    this.cargando.set(false);
    this.error.set(this.config.errorMessage);
    this.loadError.set(message);
    this.attemptedUrl.set(result.attemptedUrl);
    this.cdr.detectChanges();
  }
}
