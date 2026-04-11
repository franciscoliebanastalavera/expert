import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('capitalflow-theme', 'light');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should read theme from localStorage', () => {
    expect(service.currentTheme).toBe('light');
    expect(service.isDark()).toBe(false);
  });

  it('should toggle to the opposite theme', () => {
    const initial = service.currentTheme;
    service.toggle();
    expect(service.currentTheme).not.toBe(initial);
  });

  it('should toggle back after two toggles', () => {
    const initial = service.currentTheme;
    service.toggle();
    service.toggle();
    expect(service.currentTheme).toBe(initial);
  });

  it('should persist theme in localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('capitalflow-theme')).toBe('dark');
    expect(service.isDark()).toBe(true);
  });
});
