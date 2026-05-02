import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapStatusBadgeComponent } from './cap-status-badge.component';

@Component({
  standalone: true,
  imports: [CapStatusBadgeComponent],
  template: `<cap-status-badge [kind]="kind">PROJECTED</cap-status-badge>`,
})
class HostComponent {
  kind: 'success' | 'warning' | 'info' | 'danger' | 'neutral' = 'neutral';
}

describe('CapStatusBadgeComponent', () => {
  let fixture: ComponentFixture<CapStatusBadgeComponent>;
  let instance: CapStatusBadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapStatusBadgeComponent, HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapStatusBadgeComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the neutral modifier by default', () => {
    expect(instance).toBeInstanceOf(CapStatusBadgeComponent);
    const root = fixture.debugElement.query(By.css('.cap-status-badge'));
    expect(root).not.toBeNull();
    expect(root.nativeElement.classList.contains('cap-status-badge--neutral')).toBeTrue();
  });

  it('renders the default template as an empty span', () => {
    const root = fixture.debugElement.query(By.css('.cap-status-badge'));
    expect(root.nativeElement.tagName.toLowerCase()).toBe('span');
    expect(root.nativeElement.textContent.trim()).toBe('');
  });

  it('applies the corresponding modifier class for each kind', () => {
    const kinds: Array<'success' | 'warning' | 'info' | 'danger' | 'neutral'> = [
      'success',
      'warning',
      'info',
      'danger',
      'neutral',
    ];

    for (const kind of kinds) {
      fixture.componentRef.setInput('kind', kind);
      fixture.detectChanges();
      const root = fixture.debugElement.query(By.css('.cap-status-badge'));
      expect(root.nativeElement.classList.contains(`cap-status-badge--${kind}`)).toBeTrue();
    }
  });

  it('projects the content provided through ng-content', () => {
    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();
    const badge = hostFixture.debugElement.query(By.css('.cap-status-badge'));
    expect(badge.nativeElement.textContent.trim()).toBe('PROJECTED');
  });
});
