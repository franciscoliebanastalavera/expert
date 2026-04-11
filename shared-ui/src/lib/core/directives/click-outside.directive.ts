import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

// Directiva para detectar clics fuera de un elemento — adaptado de Nter-lib
@Directive({
  selector: '[capClickOutside]',
  standalone: false,
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  @Output() clickedOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) this.clickedOutside.emit(target);
  }
}
