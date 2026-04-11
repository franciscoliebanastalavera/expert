import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

// Servicio de tema — gestiona modo claro/oscuro con persistencia en localStorage
@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Inyección del documento para acceder al DOM de forma segura (SSR-compatible)
  private readonly document = inject(DOCUMENT);

  private readonly STORAGE_KEY = 'capitalflow-theme';
  private readonly themeSubject = new BehaviorSubject<'light' | 'dark'>(this.getInitialTheme());

  // Observable del tema actual
  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  // Obtiene el tema actual
  get currentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  // Alterna entre modo claro y oscuro
  toggle(): void {
    const next = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  // Establece un tema específico
  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  // Determina el tema inicial: localStorage > prefers-color-scheme > light
  private getInitialTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Respetar la preferencia del sistema operativo
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  // Aplica la clase de tema al elemento raíz del documento
  private applyTheme(theme: 'light' | 'dark'): void {
    const root = this.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }
}
