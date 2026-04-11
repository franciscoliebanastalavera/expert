import { Pipe, PipeTransform } from '@angular/core';

// Pipe para verificar si un elemento existe en un array — adaptado de Nter-lib
@Pipe({
  name: 'includes',
  standalone: false,
})
export class IncludesPipe implements PipeTransform {
  transform(array: any, searchElement: any) {
    if (typeof array === 'string') {
      array = JSON.parse(array.replace(/'/g, '"').replace(/,[\n\s]*]/g, ']'));
    }

    return array?.includes(searchElement);
  }
}
