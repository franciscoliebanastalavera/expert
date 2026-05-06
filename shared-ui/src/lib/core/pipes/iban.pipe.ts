import { FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iban',
  standalone: true,
})
export class IbanPipe implements PipeTransform {
  transform(value: string | number | null): string;
  transform(value: string | number | null, control: FormControl, hide: boolean): string;
  transform(value: string | number | null, control?: FormControl, hide?: boolean): string {
    if (!value) {
      return String(value);
    }
    const raw = String(value);
    if (control === undefined) {
      return raw.replace(/(.{4})/g, '$1 ').trim();
    }
    return hide
      ? `${raw.slice(0, 4)} **** **** ** ******${raw.slice(-4)}`
      : control?.value || raw;
  }
}
