import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should default to light theme', () => {
    expect(service.currentTheme).toBe('light');
  });

  it('should toggle from light to dark', () => {
    service.toggle();
    expect(service.currentTheme).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('should toggle back to light', () => {
    service.toggle();
    service.toggle();
    expect(service.currentTheme).toBe('light');
    expect(service.isDark()).toBe(false);
  });

  it('should persist theme in localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('capitalflow-theme')).toBe('dark');
  });
});
