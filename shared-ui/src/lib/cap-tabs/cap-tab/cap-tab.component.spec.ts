import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapTabComponent } from './cap-tab.component';

@Component({
  standalone: true,
  imports: [CapTabComponent],
  template: `<cap-tab [active]="true" label="Tab"><span class="projected">CONTENT</span></cap-tab>`,
})
class HostComponent {}

describe('CapTabComponent', () => {
  let fixture: ComponentFixture<CapTabComponent>;
  let instance: CapTabComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapTabComponent, HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapTabComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the tab-content root element', () => {
    expect(instance).toBeInstanceOf(CapTabComponent);
    const root = fixture.debugElement.query(By.css('.tab-content'));
    expect(root).not.toBeNull();
  });

  it('hides the tab content when active is false by default', () => {
    const root = fixture.debugElement.query(By.css('.tab-content'));
    expect(root.nativeElement.hasAttribute('hidden')).toBeTrue();
  });

  it('shows the tab content when active is true', () => {
    instance.active = true;
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.tab-content'));
    expect(root.nativeElement.hasAttribute('hidden')).toBeFalse();
  });

  it('exposes the disabled and label inputs as plain properties', () => {
    instance.disabled = true;
    instance.label = 'My Tab';
    fixture.detectChanges();
    expect(instance.disabled).toBeTrue();
    expect(instance.label).toBe('My Tab');
  });

  it('projects content via ng-content when wrapped by a host', () => {
    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();
    const projected = hostFixture.debugElement.query(By.css('.projected'));
    expect(projected).not.toBeNull();
    expect(projected.nativeElement.textContent.trim()).toBe('CONTENT');
  });
});
