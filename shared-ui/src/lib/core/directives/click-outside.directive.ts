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
  // Detecta si el clic se produjo fuera del elemento
  public onClick(target: EventTarget) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) this.clickedOutside.emit(target);
  }
}
