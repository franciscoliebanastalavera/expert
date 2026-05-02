import { of, Observable } from 'rxjs';
import { Component } from '@angular/core';

export class RouterMock {
  readonly events = of();
  readonly url = '/';
  navigate = jasmine.createSpy('navigate').and.resolveTo(true);
  navigateByUrl = jasmine.createSpy('navigateByUrl').and.resolveTo(true);
}

@Component({ standalone: true, template: '<router-outlet></router-outlet>' })
export class HostComponent {}

export function noop(): void {
  /* noop */
}

export function createMouseEvent(type: string, target: HTMLElement): MouseEvent {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'target', { value: target, enumerable: true });
  return event;
}
