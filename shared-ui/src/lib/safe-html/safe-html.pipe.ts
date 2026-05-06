import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurifyModule from 'dompurify';
const DOMPurify: { sanitize(source: string): string } = (DOMPurifyModule as never)['default'] || DOMPurifyModule;

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  /**
   * @param value - Raw (unsanitized) HTML string.
   * @returns Sanitized HTML marked as safe for Angular binding.
   */
  transform(value: string): SafeHtml {
    const clean = DOMPurify.sanitize(value);
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
