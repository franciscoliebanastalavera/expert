import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Component({
  selector: 'app-analytics-wrapper',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div #container class="mfe-container">
      @if (cargando()) {
        <div class="spinner-wrapper" [class.fade-out]="fadeOut()">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke-width="4" stroke="var(--cap-primary, #2a85c4)" stroke-linecap="round"/>
          </svg>
          <span class="spinner-text">{{ 'MFE.LOADING' | translate }}</span>
        </div>
      }
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </div>
  `,
  styles: [`
    .mfe-container {
      min-height: 25rem;
      padding: 1rem;
    }

    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 4rem 0;
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    .spinner-wrapper.fade-out {
      opacity: 0;
    }

    .spinner {
      width: 3rem;
      height: 3rem;
      animation: spin 1s linear infinite;
    }

    .spinner circle {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    @keyframes dash {
      0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
    }

    .spinner-text {
      font-size: 0.875rem;
      color: var(--cap-text-muted, #999);
    }

    .error {
      color: var(--cap-danger, #c51321);
      font-weight: 600;
      text-align: center;
      padding: 2rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly cargando = signal(true);
  readonly fadeOut = signal(false);
  readonly error = signal('');

  async ngAfterViewInit(): Promise<void> {
    const minDelay = new Promise<void>((r) => setTimeout(r, 600));

    try {
      const [module] = await Promise.all([
        loadRemoteModule({
          type: 'script',
          remoteEntry: 'http://localhost:4201/remoteEntry.js',
          remoteName: 'mfeAnalytics',
          exposedModule: './AnalyticsWeb',
        }),
        minDelay,
      ]);

      this.fadeOut.set(true);
      this.cdr.detectChanges();
      await new Promise<void>((r) => setTimeout(r, 300));

      const analyticsEl = this.document.createElement('mfe-analytics');
      this.container.nativeElement.appendChild(analyticsEl);
      this.cargando.set(false);
      this.cdr.detectChanges();
    } catch (_) {
      await minDelay;
      this.cargando.set(false);
      this.error.set('No se pudo cargar el módulo de Analytics. Verifique que el MFE esté en ejecución.');
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    const el = this.container?.nativeElement?.querySelector('mfe-analytics');
    if (el) {
      el.remove();
    }
  }
}
