import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[capClickOutside]',
  standalone: false,
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  @Output() clickedOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(target: EventTarget) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) this.clickedOutside.emit(target);
  }
}
