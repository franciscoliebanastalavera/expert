import { FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iban',
  standalone: false,
})
export class IbanPipe implements PipeTransform {
  transform(value: string | number | null, control: FormControl, hide: boolean): string {
    if (!value) {
      return String(value);
    }

    return hide
      ? `${String(value).slice(0, 4)} **** **** ** ******${String(value).slice(-4, String(value).length)}`
      : control?.value || value;
  }
}
