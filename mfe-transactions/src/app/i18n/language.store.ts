import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TxLang, detectTxLang } from '../transactions.text';

/**
 * Tracks the active UI language for the transactions MFE.
 *
 * The shell owns language selection and reflects it on <html lang> when the
 * user toggles ES/EN. This store mirrors that single source of truth with one
 * MutationObserver (same contract the analytics MFE already follows), so every
 * component can derive its strings reactively without a shell-side change.
 */
@Injectable({ providedIn: 'root' })
export class LanguageStore {
  private readonly document = inject(DOCUMENT);
  private readonly _lang = signal<TxLang>(detectTxLang(this.document.documentElement.lang));
  readonly lang = this._lang.asReadonly();

  constructor() {
    const observer = new MutationObserver(() => {
      this._lang.set(detectTxLang(this.document.documentElement.lang));
    });
    observer.observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
