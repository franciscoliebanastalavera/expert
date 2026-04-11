import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

// Componente envoltorio que carga el micro-frontend de Analytics (React) como Web Component
@Component({
  selector: 'app-analytics-wrapper',
  template: `
    <div #container class="mfe-container">
      <p *ngIf="loading">Cargando módulo de Analytics...</p>
      <p *ngIf="error" class="error">{{ error }}</p>
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

  loading = true;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    try {
      // Carga dinámica del remoto usando loadRemoteModule (compatible con esbuild)
      await loadRemoteModule({
        type: 'script',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'mfeAnalytics',
        exposedModule: './AnalyticsWeb',
      });

      // Crear el Web Component expuesto por el MFE de React
      const analyticsEl = document.createElement('mfe-analytics');
      this.container.nativeElement.appendChild(analyticsEl);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      this.error =
        'No se pudo cargar el módulo de Analytics. Verifique que el MFE esté en ejecución.';
      console.error('Error al cargar mfeAnalytics:', err);
    }
  }

  ngOnDestroy(): void {
    // Limpiar el Web Component al destruir el componente Angular
    const el = this.container?.nativeElement?.querySelector('mfe-analytics');
    if (el) {
      el.remove();
    }
  }
}
