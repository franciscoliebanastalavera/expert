import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

const HTTPS_PORT = 443;
const HTTP_PORT = 80;
const HTTPS_PROTOCOL = 'https:';
const REMOTE_ENTRY_PATH = '/remoteEntry.js';
const REMOTE_NAME = 'mfeAnalytics';
const EXPOSED_MODULE = './AnalyticsWeb';
const REMOTE_TYPE = 'script';
const MFE_ELEMENT_TAG = 'mfe-analytics';
const MIN_LOADING_DELAY_MS = 600;
const FADE_OUT_DELAY_MS = 300;

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
  readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly cargando = signal(true);
  readonly fadeOut = signal(false);
  readonly error = signal('');

  private buildMfeRemoteEntry(): string {
    const { protocol, hostname, port } = window.location;
    const shellPort = Number(port) || (protocol === HTTPS_PROTOCOL ? HTTPS_PORT : HTTP_PORT);
    const mfePort = shellPort + 1;
    return `${protocol}//${hostname}:${mfePort}${REMOTE_ENTRY_PATH}`;
  }

  async ngAfterViewInit(): Promise<void> {
    const minDelay = new Promise<void>((r) => setTimeout(r, MIN_LOADING_DELAY_MS));

    try {
      const [module] = await Promise.all([
        loadRemoteModule({
          type: REMOTE_TYPE,
          remoteEntry: this.buildMfeRemoteEntry(),
          remoteName: REMOTE_NAME,
          exposedModule: EXPOSED_MODULE,
        }),
        minDelay,
      ]);

      this.fadeOut.set(true);
      this.cdr.detectChanges();
      await new Promise<void>((r) => setTimeout(r, FADE_OUT_DELAY_MS));

      const analyticsEl = this.document.createElement(MFE_ELEMENT_TAG);
      this.container().nativeElement.appendChild(analyticsEl);
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
    const el = this.container().nativeElement.querySelector(MFE_ELEMENT_TAG);
    if (el) {
      el.remove();
    }
  }
}
