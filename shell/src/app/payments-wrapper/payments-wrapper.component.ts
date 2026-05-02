import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { CapSpinnerComponent } from '@capitalflow/shared-ui';

const REMOTE_ENTRY_PATH = '/remoteEntry.js';
const REMOTE_NAME = 'mfePayments';
const EXPOSED_MODULE = './PaymentsWeb';
const REMOTE_TYPE = 'script';
const MFE_ELEMENT_TAG = 'mfe-payments';
const MIN_LOADING_DELAY_MS = 600;
const FADE_OUT_DELAY_MS = 300;

// TODO: en producción leer endpoint del MFE de un meta-tag inyectado por nginx
// (window.__MFE_REMOTES__.payments) en vez de hardcodear el host:puerto.
const MFE_PAYMENTS_HOST = 'http://localhost:4202';

@Component({
  selector: 'app-payments-wrapper',
  standalone: true,
  imports: [TranslateModule, CapSpinnerComponent],
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

  readonly cargando = signal(true);
  readonly fadeOut = signal(false);
  readonly error = signal('');

  async ngAfterViewInit(): Promise<void> {
    const minDelay = new Promise<void>((r) => setTimeout(r, MIN_LOADING_DELAY_MS));

    try {
      const [module] = await Promise.all([
        loadRemoteModule({
          type: REMOTE_TYPE,
          remoteEntry: `${MFE_PAYMENTS_HOST}${REMOTE_ENTRY_PATH}`,
          remoteName: REMOTE_NAME,
          exposedModule: EXPOSED_MODULE,
        }),
        minDelay,
      ]);

      this.fadeOut.set(true);
      this.cdr.detectChanges();
      await new Promise<void>((r) => setTimeout(r, FADE_OUT_DELAY_MS));

      this.ngZone.runOutsideAngular(() => {
        const paymentsEl = this.document.createElement(MFE_ELEMENT_TAG);
        this.container().nativeElement.appendChild(paymentsEl);
      });
      this.cargando.set(false);
      this.cdr.detectChanges();
    } catch (_) {
      await minDelay;
      this.cargando.set(false);
      this.error.set('No se pudo cargar el módulo de Payments. Verifique que el MFE esté en ejecución.');
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
