import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapStatCardComponent } from './cap-stat-card.component';

describe('CapStatCardComponent', () => {
  let fixture: ComponentFixture<CapStatCardComponent>;
  let instance: CapStatCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapStatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapStatCardComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the neutral modifier by default', () => {
    expect(instance).toBeInstanceOf(CapStatCardComponent);
    const root = fixture.debugElement.query(By.css('.cap-stat-card'));
    expect(root).not.toBeNull();
    expect(root.nativeElement.classList.contains('cap-stat-card--neutral')).toBeTrue();
  });

  it('renders the default template with empty label and value spans', () => {
    const label = fixture.debugElement.query(By.css('.cap-stat-card__label'));
    const value = fixture.debugElement.query(By.css('.cap-stat-card__value'));
    expect(label).not.toBeNull();
    expect(value).not.toBeNull();
    expect(label.nativeElement.textContent.trim()).toBe('');
    expect(value.nativeElement.textContent.trim()).toBe('');
  });

  it('renders the label and value text from inputs', () => {
    fixture.componentRef.setInput('label', 'Revenue');
    fixture.componentRef.setInput('value', '€1,234');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.cap-stat-card__label'));
    const value = fixture.debugElement.query(By.css('.cap-stat-card__value'));
    expect(label.nativeElement.textContent.trim()).toBe('Revenue');
    expect(value.nativeElement.textContent.trim()).toBe('€1,234');
  });

  it('applies the kind modifier for positive and negative values', () => {
    fixture.componentRef.setInput('kind', 'positive');
    fixture.detectChanges();
    let root = fixture.debugElement.query(By.css('.cap-stat-card'));
    expect(root.nativeElement.classList.contains('cap-stat-card--positive')).toBeTrue();

    fixture.componentRef.setInput('kind', 'negative');
    fixture.detectChanges();
    root = fixture.debugElement.query(By.css('.cap-stat-card'));
    expect(root.nativeElement.classList.contains('cap-stat-card--negative')).toBeTrue();
  });
});
