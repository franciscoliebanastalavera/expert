import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { catchError, EMPTY, from, tap } from 'rxjs';
import { TransactionsComponent } from './app/transactions.component';

const ELEMENT_TAG = 'mfe-transactions';

from(createApplication({ providers: [] }))
  .pipe(
    tap((appRef) => {
      const TransactionsElement = createCustomElement(TransactionsComponent, {
        injector: appRef.injector,
      });
      if (!customElements.get(ELEMENT_TAG)) {
        customElements.define(ELEMENT_TAG, TransactionsElement);
      }
    }),
    catchError((err) => {
      console.error('mfe-transactions custom element registration failed', err);
      return EMPTY;
    })
  )
  .subscribe();
