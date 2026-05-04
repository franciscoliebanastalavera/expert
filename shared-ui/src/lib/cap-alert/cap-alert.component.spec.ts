import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapAlertComponent } from './cap-alert.component';
import { CapAlertKind } from './cap-alert.types';

describe('CapAlertComponent', () => {
  let fixture: ComponentFixture<CapAlertComponent>;
  let component: CapAlertComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapAlertComponent);
    component = fixture.componentInstance;
  });

  it('defaults to kind="info" when no kind is provided', () => {
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.cap-alert'));
    expect(component.kind()).toBe('info');
    expect(root.nativeElement.classList.contains('cap-alert--info')).toBeTrue();
  });

  it('renders the message via interpolation (escaping HTML)', () => {
    fixture.componentRef.setInput('message', '<script>alert(1)</script>');
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.cap-alert'));
    expect(root.nativeElement.querySelector('script')).toBeNull();
    expect(root.nativeElement.textContent).toContain('<script>alert(1)</script>');
  });

  it('applies the kind modifier class for every supported kind', () => {
    const kinds: CapAlertKind[] = ['info', 'success', 'warning', 'danger'];
    kinds.forEach((kind) => {
      fixture.componentRef.setInput('kind', kind);
      fixture.detectChanges();
      const root = fixture.debugElement.query(By.css('.cap-alert'));
      expect(root.nativeElement.classList.contains(`cap-alert--${kind}`))
        .withContext(`expected cap-alert--${kind} class`)
        .toBeTrue();
    });
  });

  it('exposes role="alert" on the root element for screen readers', () => {
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.cap-alert'));
    expect(root.nativeElement.getAttribute('role')).toBe('alert');
  });
});
