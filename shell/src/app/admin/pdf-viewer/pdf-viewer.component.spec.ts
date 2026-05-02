import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfViewerComponent } from './pdf-viewer.component';

describe('PdfViewerComponent', () => {
  let fixture: ComponentFixture<PdfViewerComponent>;
  let component: PdfViewerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('rejects javascript: protocol injection attempt', () => {
    component.urlControl.setValue('javascript:alert(1)');
    component.load();
    expect(component.trustedUrl()).toBeNull();
    expect(component.errorMessage()).toContain('Invalid report URL');
  });

  it('accepts a well-formed HTTPS report URL', () => {
    component.urlControl.setValue('https://reports.capitalflow.example.com/reports/q1-2026.pdf');
    component.load();
    expect(component.trustedUrl()).not.toBeNull();
    expect(component.errorMessage()).toBe('');
  });
});
