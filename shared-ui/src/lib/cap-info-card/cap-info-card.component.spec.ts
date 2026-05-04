import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapButtonComponent } from '../cap-button/cap-button.component';
import { CapInfoCardComponent } from './cap-info-card.component';

describe('CapInfoCardComponent', () => {
  let fixture: ComponentFixture<CapInfoCardComponent>;
  let component: CapInfoCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapInfoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapInfoCardComponent);
    component = fixture.componentInstance;
  });

  it('renders the title and description via interpolation (escaping HTML)', () => {
    fixture.componentRef.setInput('title', '<script>alert(1)</script>');
    fixture.componentRef.setInput('description', 'safe text');
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('.cap-info-card__title'));
    expect(titleEl.nativeElement.querySelector('script')).toBeNull();
    expect(titleEl.nativeElement.textContent).toContain('<script>alert(1)</script>');

    const descEl = fixture.debugElement.query(By.css('.cap-info-card__description'));
    expect(descEl.nativeElement.textContent.trim()).toBe('safe text');
  });

  it('embeds a cap-button with the configured ctaLabel', () => {
    fixture.componentRef.setInput('ctaLabel', 'Open demo');
    fixture.detectChanges();
    const btnDe = fixture.debugElement.query(By.directive(CapButtonComponent));
    expect(btnDe).not.toBeNull();
    const btnInstance = btnDe.componentInstance as CapButtonComponent;
    expect(btnInstance.label()).toBe('Open demo');
  });

  it('emits ctaClick when handleCtaClick runs', () => {
    let emitted = 0;
    component.ctaClick.subscribe(() => (emitted += 1));
    component.handleCtaClick();
    expect(emitted).toBe(1);
  });

  it('forwards capClick from the inner cap-button to ctaClick', () => {
    fixture.detectChanges();
    let emitted = 0;
    component.ctaClick.subscribe(() => (emitted += 1));

    const btnDe = fixture.debugElement.query(By.directive(CapButtonComponent));
    const btnInstance = btnDe.componentInstance as CapButtonComponent;
    btnInstance.capClick.emit();

    expect(emitted).toBe(1);
  });
});
