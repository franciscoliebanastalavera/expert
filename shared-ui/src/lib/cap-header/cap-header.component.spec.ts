import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { CapHeaderComponent } from './cap-header.component';

describe('CapHeaderComponent', () => {
  let fixture: ComponentFixture<CapHeaderComponent>;
  let instance: CapHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapHeaderComponent],
      providers: [provideRouter([], withDisabledInitialNavigation())],
    }).compileComponents();

    fixture = TestBed.createComponent(CapHeaderComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the header element', () => {
    expect(instance).toBeInstanceOf(CapHeaderComponent);
    const header = fixture.debugElement.query(By.css('header.cap-header'));
    expect(header).not.toBeNull();
  });

  it('renders the default brand title and the inline svg logo', () => {
    const title = fixture.debugElement.query(By.css('.cap-header__title'));
    expect(title.nativeElement.textContent.trim()).toBe('CapitalFlow');
    expect(fixture.debugElement.query(By.css('svg.cap-header__logo'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('img.cap-header__logo'))).toBeNull();
  });

  it('renders an image logo when brandIcon input is set', () => {
    fixture.componentRef.setInput('brandName', 'BrandX');
    fixture.componentRef.setInput('brandIcon', '/logo.png');
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img.cap-header__logo'));
    expect(img).not.toBeNull();
    expect(img.nativeElement.getAttribute('src')).toBe('/logo.png');
    expect(img.nativeElement.getAttribute('alt')).toBe('BrandX');
    expect(fixture.debugElement.query(By.css('svg.cap-header__logo'))).toBeNull();
  });

  it('renders the provided nav items as links', () => {
    fixture.componentRef.setInput('navItems', [
      { label: 'Home', route: '/home' },
      { label: 'About', route: '/about' },
    ]);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.cap-header__link'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.textContent.trim()).toBe('Home');
    expect(links[1].nativeElement.textContent.trim()).toBe('About');
  });

  it('hides theme toggle and language selector when their inputs are false', () => {
    fixture.componentRef.setInput('showThemeToggle', false);
    fixture.componentRef.setInput('showLangSelector', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cap-header__btn'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.cap-header__lang'))).toBeNull();
  });

  it('emits themeToggle when the toggle button is clicked', () => {
    const spy = spyOn(instance.themeToggle, 'emit');
    const btn = fixture.debugElement.query(By.css('.cap-header__btn'));
    btn.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('emits langChange with the next language when the language button is clicked', () => {
    const spy = spyOn(instance.langChange, 'emit');
    fixture.componentRef.setInput('currentLang', 'es');
    fixture.detectChanges();
    instance.onLangChange();
    expect(spy).toHaveBeenCalledWith('en');

    fixture.componentRef.setInput('currentLang', 'en');
    fixture.detectChanges();
    instance.onLangChange();
    expect(spy).toHaveBeenCalledWith('es');
  });

  it('toggles the menu open state', () => {
    expect(instance.menuOpen).toBeFalse();
    instance.toggleMenu();
    expect(instance.menuOpen).toBeTrue();
    instance.toggleMenu();
    expect(instance.menuOpen).toBeFalse();
  });

  it('closes the menu when closeMenu() is invoked after opening', () => {
    instance.toggleMenu();
    expect(instance.menuOpen).toBeTrue();
    instance.closeMenu();
    expect(instance.menuOpen).toBeFalse();
  });

  it('closes the menu when document click occurs outside the host element', () => {
    instance.toggleMenu();
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(instance.menuOpen).toBeTrue();

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outside, enumerable: true });
    instance.onDocumentClick(event);
    expect(instance.menuOpen).toBeFalse();
    document.body.removeChild(outside);
  });

  it('keeps the menu open when document click occurs inside the host element', () => {
    instance.toggleMenu();
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const inside = fixture.debugElement.query(By.css('.cap-header__title')).nativeElement as HTMLElement;
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: inside, enumerable: true });
    instance.onDocumentClick(event);
    expect(instance.menuOpen).toBeTrue();
  });

  it('closes the menu on window resize when wider than the desktop breakpoint', () => {
    instance.toggleMenu();
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
    instance.onWindowResize();
    expect(instance.menuOpen).toBeFalse();
  });

  it('does not close the menu on resize when narrower than the desktop breakpoint', () => {
    instance.toggleMenu();
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    spyOnProperty(window, 'innerWidth').and.returnValue(400);
    instance.onWindowResize();
    expect(instance.menuOpen).toBeTrue();
  });
});
