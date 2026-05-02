import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerComponent } from './pdf-viewer.component';

describe('PdfViewerComponent', () => {
  let fixture: ComponentFixture<PdfViewerComponent>;
  let component: PdfViewerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfViewerComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
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
    expect(component.validatedUrl()).toBe('');
    expect(component.errorKey()).toBe('ADMIN.DEMOS.PDF.INVALID_URL');
  });

  it('accepts a well-formed HTTPS report URL', () => {
    const url = 'https://reports.capitalflow.example.com/reports/q1-2026.pdf';
    component.urlControl.setValue(url);
    component.load();
    expect(component.validatedUrl()).toBe(url);
    expect(component.errorKey()).toBe('');
  });

  it('navigates back to the admin landing when goBack is called', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navSpy).toHaveBeenCalledWith(['/admin']);
  });
});
