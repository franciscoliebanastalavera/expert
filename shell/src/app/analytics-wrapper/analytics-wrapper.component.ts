import {
  Component,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
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
  templateUrl: './analytics-wrapper.component.html',
  styleUrls: ['./analytics-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnalyticsWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly cargando = signal(true);
  readonly fadeOut = signal(false);
  readonly error = signal('');

  private buildMfeRemoteEntry(): string {
    const { protocol, hostname, port } = window.location;
    const shellPort = Number(port) || (protocol === 'https:' ? 443 : 80);
    const mfePort = shellPort + 1;
    return `${protocol}//${hostname}:${mfePort}/remoteEntry.js`;
  }

  async ngAfterViewInit(): Promise<void> {
    const minDelay = new Promise<void>((r) => setTimeout(r, 600));

    try {
      const [module] = await Promise.all([
        loadRemoteModule({
          type: 'script',
          remoteEntry: this.buildMfeRemoteEntry(),
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
