import {
  AfterViewInit,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap, tap, timer } from 'rxjs';
import { RemoteMfeConfig, RemoteMfeLoadResult } from '../../models';
import { RemoteMfeLoaderService } from '../../services/remote-mfe-loader.service';

@Directive()
export abstract class MfeWrapperBaseComponent implements AfterViewInit {
  readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  protected readonly document = inject(DOCUMENT);
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly remoteLoader = inject(RemoteMfeLoaderService);
  protected readonly ngZone = inject(NgZone);

  protected abstract readonly config: RemoteMfeConfig;

  readonly cargando = signal(true);
  readonly fadeOut = signal(false);
  readonly error = signal('');
  readonly loadAttempts = signal(0);
  readonly loadError = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      const el = this.container().nativeElement.querySelector(this.config.elementTag);
      if (el) {
        el.remove();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadRemote();
  }

  retryLoad(): void {
    this.loadAttempts.update((attempts) => attempts + 1);
    this.loadRemote();
  }

  protected loadRemote(): void {
    this.cargando.set(true);
    this.fadeOut.set(false);
    this.error.set('');
    this.loadError.set(null);
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

  protected appendMfeElement(result: RemoteMfeLoadResult): void {
    if (!result.success) {
      return;
    }
    const existing = this.container().nativeElement.querySelector(result.customElementTag);
    if (existing) {
      existing.remove();
    }
    this.createAndAppend(result.customElementTag);
    this.cargando.set(false);
    this.cdr.detectChanges();
  }

  protected createAndAppend(tag: string): void {
    this.ngZone.runOutsideAngular(() => {
      const el = this.document.createElement(tag);
      this.container().nativeElement.appendChild(el);
    });
  }

  protected showError(result: RemoteMfeLoadResult): void {
    if (result.success) {
      return;
    }
    const message = `${result.attemptedUrl} - ${result.error}`;
    this.cargando.set(false);
    this.error.set(this.config.errorMessage);
    this.loadError.set(message);
    this.cdr.detectChanges();
  }
}
