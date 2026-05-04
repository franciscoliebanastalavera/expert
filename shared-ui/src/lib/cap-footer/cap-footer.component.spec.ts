import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapFooterComponent } from './cap-footer.component';

describe('CapFooterComponent', () => {
  let fixture: ComponentFixture<CapFooterComponent>;
  let instance: CapFooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapFooterComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the footer root element', () => {
    expect(instance).toBeInstanceOf(CapFooterComponent);
    const root = fixture.debugElement.query(By.css('footer.cap-footer'));
    expect(root).not.toBeNull();
  });

  it('renders the default copyright text in the template', () => {
    const span = fixture.debugElement.query(By.css('footer.cap-footer span'));
    expect(span).not.toBeNull();
    expect(span.nativeElement.textContent).toContain('CapitalFlow');
    expect(span.nativeElement.textContent).toContain('2026');
  });

  it('renders the provided copyright text when the input changes', () => {
    fixture.componentRef.setInput('copyrightText', 'Custom Copyright 2030');
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('footer.cap-footer span'));
    expect(span.nativeElement.textContent.trim()).toBe('Custom Copyright 2030');
  });

  it('reflects an empty string copyright as an empty span', () => {
    fixture.componentRef.setInput('copyrightText', '');
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('footer.cap-footer span'));
    expect(span.nativeElement.textContent.trim()).toBe('');
  });
});
