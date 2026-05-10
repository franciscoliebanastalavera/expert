import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  selector: '[capClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  readonly clickedOutside = output<EventTarget>();

  @HostListener('document:click', ['$event.target'])
  public onClick(target: EventTarget | null) {
    if (!target) return;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) this.clickedOutside.emit(target);
  }
}
