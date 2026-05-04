import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { WysiwygEditorComponent } from './wysiwyg-editor.component';

describe('WysiwygEditorComponent', () => {
  let fixture: ComponentFixture<WysiwygEditorComponent>;
  let component: WysiwygEditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygEditorComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(WysiwygEditorComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('exposes empty preview signals before save() runs', () => {
    expect(component.rawHtml()).toBe('');
    expect(component.hasInjectionAttempt()).toBeFalse();
  });

  it('strips script and onerror after save with malicious payload', () => {
    fixture.detectChanges();

    component.injectTestPayload();
    component.save();

    const sanitized = component.sanitizedHtml();
    expect(sanitized).not.toContain('<script');
    expect(sanitized).not.toContain('onerror=');
  });

  it('navigates back to the admin landing when goBack is called', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navSpy).toHaveBeenCalledWith(['/admin']);
  });
});
