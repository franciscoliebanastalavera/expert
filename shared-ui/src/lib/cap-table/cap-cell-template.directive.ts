import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  selector: '[capCellTemplate]',
  standalone: true,
})
export class CapCellTemplateDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);

  readonly columnKey = input.required<string>({ alias: 'capCellTemplate' });
}
