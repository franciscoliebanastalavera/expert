import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

/**
 * Pipe que sanitiza contenido HTML usando DOMPurify.
 * Devuelve un valor SafeHtml que Angular puede renderizar de forma segura.
 *
 * Uso en plantillas:
 *   <div [innerHTML]="htmlContent | safeHtml"></div>
 */
@Pipe({
  name: 'safeHtml',
  standalone: false,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  /**
   * Transforma una cadena HTML en un valor SafeHtml sanitizado.
   * @param value - Cadena HTML sin sanitizar
   * @returns HTML sanitizado y marcado como seguro para Angular
   */
  transform(value: string): SafeHtml {
    // Primero sanitiza con DOMPurify, luego marca como seguro para Angular
    const clean = DOMPurify.sanitize(value);
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
