import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapSpinnerComponent } from './cap-spinner.component';

describe('CapSpinnerComponent', () => {
  let fixture: ComponentFixture<CapSpinnerComponent>;
  let instance: CapSpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapSpinnerComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the default root element', () => {
    expect(instance).toBeInstanceOf(CapSpinnerComponent);
    const root = fixture.debugElement.query(By.css('.cap-spinner'));
    expect(root).not.toBeNull();
    expect(root.nativeElement.classList.contains('cap-spinner--medium')).toBeTrue();
  });

  it('renders the default template without a label', () => {
    const label = fixture.debugElement.query(By.css('.cap-spinner__label'));
    expect(label).toBeNull();
    const svg = fixture.debugElement.query(By.css('.cap-spinner__svg'));
    expect(svg).not.toBeNull();
  });

  it('renders the label when one is provided', () => {
    fixture.componentRef.setInput('label', 'Loading data');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.cap-spinner__label'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent.trim()).toBe('Loading data');
  });

  it('applies the size modifier class for the size input', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    let root = fixture.debugElement.query(By.css('.cap-spinner'));
    expect(root.nativeElement.classList.contains('cap-spinner--large')).toBeTrue();

    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    root = fixture.debugElement.query(By.css('.cap-spinner'));
    expect(root.nativeElement.classList.contains('cap-spinner--small')).toBeTrue();
  });
});
