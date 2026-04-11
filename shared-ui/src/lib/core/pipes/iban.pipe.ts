import { FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

// Pipe para formatear y ocultar números IBAN — adaptado de Nter-lib
@Pipe({
  name: 'iban',
  standalone: false,
})
export class IbanPipe implements PipeTransform {
  transform(value: unknown, control: FormControl, hide: boolean): string {
    if (!value) {
      return String(value);
    }

    // Si hide es true, muestra solo los 4 primeros y últimos caracteres
    return hide
      ? `${String(value).slice(0, 4)} **** **** ** ******${String(value).slice(-4, String(value).length)}`
      : control?.value || value;
  }
}
