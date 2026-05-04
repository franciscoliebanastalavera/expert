import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppLanguage, LANGUAGE_STORAGE_KEY } from './language.constants';
import { TranslateServiceMock } from '../testing/mocks';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslateStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('initialises idiomaActual from resolveInitialLanguage (default English when storage empty)', () => {
    expect(component.idiomaActual()).toBe(AppLanguage.En);
  });

  it('sets the document language to the resolved initial language', () => {
    expect(document.documentElement.lang).toBe(AppLanguage.En);
  });

  it('starts with the menu closed and toggles the boolean flag', () => {
    expect(component.menuAbierto).toBeFalse();
    component.toggleMenu();
    expect(component.menuAbierto).toBeTrue();
    component.toggleMenu();
    expect(component.menuAbierto).toBeFalse();
  });

  it('cambiarIdioma without an argument toggles between Spanish and English', () => {
    expect(component.idiomaActual()).toBe(AppLanguage.En);
    component.cambiarIdioma();
    expect(component.idiomaActual()).toBe(AppLanguage.Es);
    component.cambiarIdioma();
    expect(component.idiomaActual()).toBe(AppLanguage.En);
  });

  it('cambiarIdioma with an explicit language sets that language and persists it', () => {
    component.cambiarIdioma(AppLanguage.Es);
    expect(component.idiomaActual()).toBe(AppLanguage.Es);
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe(AppLanguage.Es);
    expect(document.documentElement.lang).toBe(AppLanguage.Es);
  });

  it('calls TranslateService.use when cambiarIdioma runs', () => {
    const translate = TestBed.inject(TranslateService);
    const useSpy = spyOn(translate, 'use').and.callThrough();
    component.cambiarIdioma(AppLanguage.Es);
    expect(useSpy).toHaveBeenCalledWith(AppLanguage.Es);
  });

  it('builds the navItems signal with 6 entries from the translate streams', () => {
    const items = component.navItems();
    expect(items.length).toBe(6);
    expect(items.map((i) => i.route)).toEqual([
      '/',
      '/analytics',
      '/analytics-mfe',
      '/payments-mfe',
      '/admin',
      '/design-system',
    ]);
  });

  it('exposes the ThemeService for the header bindings', () => {
    expect(component.themeService).toBeDefined();
    expect(typeof component.themeService.toggle).toBe('function');
    expect(typeof component.themeService.isDark).toBe('function');
  });
});
