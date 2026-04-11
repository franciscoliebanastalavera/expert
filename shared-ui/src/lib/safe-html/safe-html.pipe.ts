import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurifyModule from 'dompurify';
const DOMPurify: { sanitize(source: string): string } = (DOMPurifyModule as never)['default'] || DOMPurifyModule;

@Pipe({
  name: 'safeHtml',
  standalone: false,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  /**
   * @param value - Cadena HTML sin sanitizar
   * @returns HTML sanitizado y marcado como seguro para Angular
   */
  transform(value: string): SafeHtml {
    const clean = DOMPurify.sanitize(value);
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
