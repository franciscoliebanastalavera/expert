import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';
import { DirectivesModule } from './directives.module';

@Component({
  standalone: true,
  imports: [DirectivesModule],
  template: `
    <div data-role="outside">outside</div>
    <div
      data-role="host"
      capClickOutside
      (clickedOutside)="onOutside($event)">
      <button data-role="inside">inside</button>
    </div>
  `,
})
class HostComponent {
  outsideEvents: EventTarget[] = [];

  onOutside(target: EventTarget): void {
    this.outsideEvents.push(target);
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let outsideEl: HTMLElement;
  let insideEl: HTMLElement;
  let hostEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    outsideEl = fixture.debugElement.query(By.css('[data-role="outside"]')).nativeElement;
    insideEl = fixture.debugElement.query(By.css('[data-role="inside"]')).nativeElement;
    hostEl = fixture.debugElement.query(By.css('[data-role="host"]')).nativeElement;
  });

  it('creates the directive and attaches it to the host element', () => {
    const directiveDe: DebugElement = fixture.debugElement.query(By.directive(ClickOutsideDirective));
    expect(directiveDe).toBeTruthy();
    expect(directiveDe.injector.get(ClickOutsideDirective)).toBeInstanceOf(ClickOutsideDirective);
  });

  it('emits clickedOutside when document click happens outside the host', () => {
    outsideEl.click();
    expect(host.outsideEvents.length).toBe(1);
    expect(host.outsideEvents[0]).toBe(outsideEl);
  });

  it('does not emit when click happens inside the host element', () => {
    insideEl.click();
    expect(host.outsideEvents.length).toBe(0);
  });

  it('does not emit when click happens on the host element itself', () => {
    hostEl.click();
    expect(host.outsideEvents.length).toBe(0);
  });

  it('emits multiple times on repeated outside clicks', () => {
    outsideEl.click();
    outsideEl.click();
    outsideEl.click();
    expect(host.outsideEvents.length).toBe(3);
  });

  it('does not emit on inside clicks even after a previous outside click', () => {
    outsideEl.click();
    insideEl.click();
    expect(host.outsideEvents.length).toBe(1);
  });
});
