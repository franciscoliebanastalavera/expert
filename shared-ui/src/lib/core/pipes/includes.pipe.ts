import { Pipe, PipeTransform } from '@angular/core';

// Pipe para verificar si un elemento existe en un array — adaptado de Nter-lib
@Pipe({
  name: 'includes',
  standalone: false,
})
export class IncludesPipe implements PipeTransform {
  // Comprueba si el elemento buscado existe en el array o cadena proporcionada
  transform(array: unknown[] | string, searchElement: unknown): boolean {
    if (typeof array === 'string') {
      array = JSON.parse(array.replace(/'/g, '"').replace(/,[\n\s]*]/g, ']'));
    }

    return (array as unknown[])?.includes(searchElement);
  }
}
