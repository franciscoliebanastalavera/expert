import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DocumentUploadsComponent } from './document-uploads.component';

describe('DocumentUploadsComponent', () => {
  let fixture: ComponentFixture<DocumentUploadsComponent>;
  let component: DocumentUploadsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentUploadsComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the hostile filename as literal text instead of executing it', () => {
    const cells = fixture.debugElement.queryAll(By.css('.document-uploads__filename'));
    const hostileCell = cells.find((c) =>
      c.nativeElement.textContent.includes('<img src=x onerror=')
    );
    expect(hostileCell).toBeDefined();
    expect(hostileCell?.nativeElement.querySelector('img')).toBeNull();
  });

  it('navigates back to the admin landing when goBack is called', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navSpy).toHaveBeenCalledWith(['/admin']);
  });
});
