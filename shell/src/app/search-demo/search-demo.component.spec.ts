import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { SearchDemoComponent } from './search-demo.component';

describe('SearchDemoComponent', () => {
  let fixture: ComponentFixture<SearchDemoComponent>;
  let component: SearchDemoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDemoComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the reflected query as literal text without executing scripts', () => {
    component.queryControl.setValue('<script>alert(1)</script>');
    component.search();
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.search-demo__heading'));
    expect(heading).not.toBeNull();
    expect(heading.nativeElement.querySelector('script')).toBeNull();
    expect(heading.nativeElement.textContent).toContain('<script>alert(1)</script>');
  });

  it('renders injected xss payload as literal text via innerText', () => {
    component.injectTestPayload();
    component.search();
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.search-demo__heading'));
    expect(heading.nativeElement.querySelector('script')).toBeNull();
    expect(heading.nativeElement.textContent).toContain('<script>');
  });

  it('navigates back to the admin landing when goBack is called', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navSpy).toHaveBeenCalledWith(['/admin']);
  });
});
