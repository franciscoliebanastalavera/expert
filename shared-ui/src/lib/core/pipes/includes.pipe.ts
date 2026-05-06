import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includes',
  standalone: true,
})
export class IncludesPipe implements PipeTransform {
  transform(array: (string | number | boolean)[] | string, searchElement: string | number | boolean): boolean {
    if (typeof array === 'string') {
      array = JSON.parse(array.replace(/'/g, '"').replace(/,[\n\s]*]/g, ']'));
    }

    return (array as (string | number | boolean)[])?.includes(searchElement);
  }
}
