import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapMetricCardComponent } from './cap-metric-card.component';

describe('CapMetricCardComponent', () => {
  let fixture: ComponentFixture<CapMetricCardComponent>;
  let instance: CapMetricCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapMetricCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapMetricCardComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the cap-metric-card root element', () => {
    expect(instance).toBeInstanceOf(CapMetricCardComponent);
    const root = fixture.debugElement.query(By.css('.cap-metric-card'));
    expect(root).not.toBeNull();
    expect(root.nativeElement.classList.contains('cap-metric-card--clickable')).toBeFalse();
  });

  it('renders the default empty template without optional sections', () => {
    expect(fixture.debugElement.query(By.css('cap-icon'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.cap-metric-card__variation'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.cap-metric-card__title'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.cap-metric-card__description'))).toBeNull();
    const value = fixture.debugElement.query(By.css('.cap-metric-card__value'));
    expect(value.nativeElement.textContent.trim()).toBe('');
  });

  it('renders title, description, value and variation when inputs are set', () => {
    fixture.componentRef.setInput('title', 'Sales');
    fixture.componentRef.setInput('description', 'Daily total');
    fixture.componentRef.setInput('value', '1000');
    fixture.componentRef.setInput('variation', '+10%');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cap-metric-card__title')).nativeElement.textContent.trim()).toBe('Sales');
    expect(fixture.debugElement.query(By.css('.cap-metric-card__description')).nativeElement.textContent.trim()).toBe('Daily total');
    expect(fixture.debugElement.query(By.css('.cap-metric-card__value')).nativeElement.textContent.trim()).toBe('1000');
    const variation = fixture.debugElement.query(By.css('.cap-metric-card__variation'));
    expect(variation.nativeElement.textContent.trim()).toBe('+10%');
    expect(variation.nativeElement.classList.contains('cap-metric-card__variation--positive')).toBeTrue();
  });

  it('applies the negative variation modifier when positive is false', () => {
    fixture.componentRef.setInput('variation', '-5%');
    fixture.componentRef.setInput('positive', false);
    fixture.detectChanges();
    const variation = fixture.debugElement.query(By.css('.cap-metric-card__variation'));
    expect(variation.nativeElement.classList.contains('cap-metric-card__variation--negative')).toBeTrue();
  });

  it('renders the icon when iconName is provided', () => {
    fixture.componentRef.setInput('iconName', 'home');
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('cap-icon.cap-metric-card__icon'));
    expect(icon).not.toBeNull();
  });

  it('emits cardClick when clickable and the card is clicked', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.cap-metric-card'));
    expect(root.nativeElement.classList.contains('cap-metric-card--clickable')).toBeTrue();
    const spy = spyOn(instance.cardClick, 'emit');
    root.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit cardClick when clickable is false', () => {
    const spy = spyOn(instance.cardClick, 'emit');
    const root = fixture.debugElement.query(By.css('.cap-metric-card'));
    root.nativeElement.click();
    expect(spy).not.toHaveBeenCalled();
  });
});
