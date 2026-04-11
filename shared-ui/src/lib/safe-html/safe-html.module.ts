import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from './safe-html.pipe';

/**
 * Modulo del pipe SafeHtml.
 * Declara y exporta el pipe para sanitizar HTML con DOMPurify.
 */
@NgModule({
  declarations: [SafeHtmlPipe],
  exports: [SafeHtmlPipe],
})
export class SafeHtmlModule {}
