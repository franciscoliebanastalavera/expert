import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Component({
  selector: 'app-analytics-wrapper',
  template: `
    <div #container class="mfe-container">
      @if (loading) {
        <p>Cargando módulo de Analytics...</p>
      }
      @if (error) {
        <p class="error">{{ error }}</p>
      }
    </div>
  `,
  styles: [
    `
      .mfe-container {
        min-height: 400px;
        padding: 1rem;
      }
      .error {
        color: #c62828;
        font-weight: bold;
      }
    `,
  ],
})
export class AnalyticsWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private readonly document = inject(DOCUMENT);

  loading = true;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    try {
      await loadRemoteModule({
        type: 'script',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'mfeAnalytics',
        exposedModule: './AnalyticsWeb',
      });

      const analyticsEl = this.document.createElement('mfe-analytics');
      this.container.nativeElement.appendChild(analyticsEl);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      this.error =
        'No se pudo cargar el módulo de Analytics. Verifique que el MFE esté en ejecución.';
    }
  }

  ngOnDestroy(): void {
    const el = this.container?.nativeElement?.querySelector('mfe-analytics');
    if (el) {
      el.remove();
    }
  }
}
