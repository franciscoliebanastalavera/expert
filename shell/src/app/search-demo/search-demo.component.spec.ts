import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchDemoComponent } from './search-demo.component';

describe('SearchDemoComponent', () => {
  let fixture: ComponentFixture<SearchDemoComponent>;
  let component: SearchDemoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDemoComponent],
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
    // No real <script> child gets injected — Angular escapes via [innerText].
    expect(heading.nativeElement.querySelector('script')).toBeNull();
    expect(heading.nativeElement.textContent).toContain('<script>alert(1)</script>');
  });
});
