import { NgZone, ɵNoopNgZone } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { PaymentsComponent } from './app/payments.component';

const ELEMENT_TAG = 'mfe-payments';

createApplication({
  providers: [{ provide: NgZone, useClass: ɵNoopNgZone }],
})
  .then((appRef) => {
    const PaymentsElement = createCustomElement(PaymentsComponent, {
      injector: appRef.injector,
    });
    if (!customElements.get(ELEMENT_TAG)) {
      customElements.define(ELEMENT_TAG, PaymentsElement);
    }
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('mfe-payments custom element registration failed', err);
  });
