import { Injectable, inject, RendererFactory2, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly renderer: Renderer2;

  private readonly STORAGE_KEY = 'capitalflow-theme';
  private readonly themeSubject = new BehaviorSubject<'light' | 'dark'>(this.getInitialTheme());

  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    const rendererFactory = inject(RendererFactory2);
    this.renderer = rendererFactory.createRenderer(null, null);
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  toggle(): void {
    const next = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private getInitialTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const html = this.document.documentElement;
    const body = this.document.body;

    if (theme === 'dark') {
      this.renderer.addClass(html, 'dark-theme');
      this.renderer.removeClass(html, 'light-theme');
      this.renderer.addClass(body, 'dark-theme');
      this.renderer.removeClass(body, 'light-theme');
    } else {
      this.renderer.addClass(html, 'light-theme');
      this.renderer.removeClass(html, 'dark-theme');
      this.renderer.addClass(body, 'light-theme');
      this.renderer.removeClass(body, 'dark-theme');
    }
  }
}
