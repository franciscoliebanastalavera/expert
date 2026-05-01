import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[capCellTemplate]',
  standalone: true,
})
export class CapCellTemplateDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);

  @Input({ required: true, alias: 'capCellTemplate' }) columnKey!: string;
}
