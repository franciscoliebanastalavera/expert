import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { catchError, EMPTY, from, tap } from 'rxjs';
import { PaymentsComponent } from './app/payments.component';

const ELEMENT_TAG = 'mfe-payments';

from(createApplication({ providers: [] }))
  .pipe(
    tap((appRef) => {
      const PaymentsElement = createCustomElement(PaymentsComponent, {
        injector: appRef.injector,
      });
      if (!customElements.get(ELEMENT_TAG)) {
        customElements.define(ELEMENT_TAG, PaymentsElement);
      }
    }),
    catchError((err) => {
      console.error('mfe-payments custom element registration failed', err);
      return EMPTY;
    })
  )
  .subscribe();
