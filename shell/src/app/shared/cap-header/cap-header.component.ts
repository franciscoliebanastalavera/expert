import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'cap-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="cap-header">
      <a class="cap-header__brand" routerLink="/">
        <svg *ngIf="!brandIcon" class="cap-header__logo" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#fff" fill-opacity="0.15"/>
          <path d="M10 16.5l3-3 2 2 4-4 3 3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <img *ngIf="brandIcon" class="cap-header__logo" [src]="brandIcon" [alt]="brandName" />
        <span class="cap-header__title">{{ brandName }}</span>
      </a>

      <button class="cap-header__hamburger" (click)="menuOpen = !menuOpen" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <nav class="cap-header__nav" [class.cap-header__nav--open]="menuOpen">
        <a *ngFor="let item of navItems"
           class="cap-header__link"
           [routerLink]="item.route"
           routerLinkActive="cap-header__link--active"
           [routerLinkActiveOptions]="{ exact: item.route === '/' }"
           (click)="menuOpen = false">
          {{ item.label }}
        </a>
      </nav>

      <div class="cap-header__actions" [class.cap-header__actions--open]="menuOpen">
        <button *ngIf="showThemeToggle" class="cap-header__btn" (click)="themeToggle.emit()" [attr.aria-label]="isDark ? 'Light mode' : 'Dark mode'">
          <svg *ngIf="isDark" class="cap-header__icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="!isDark" class="cap-header__icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>
        <button *ngIf="showLangSelector" class="cap-header__lang" (click)="onLangChange()" aria-label="Change language">
          {{ currentLang === 'es' ? 'EN' : 'ES' }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    .cap-header {
      display: flex; align-items: center; background: var(--cap-primary, #2a85c4);
      color: #fff; padding: 0 1.5rem; height: 3.5rem; box-shadow: var(--cap-shadow-sm);
      position: relative;
    }
    .cap-header__brand {
      display: flex; align-items: center; gap: 0.625rem; text-decoration: none;
      color: #fff; margin-right: 2.5rem;
    }
    .cap-header__logo { width: 2rem; height: 2rem; flex-shrink: 0; }
    .cap-header__title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
    .cap-header__nav { display: flex; gap: 0.25rem; flex: 1; }
    .cap-header__link {
      display: flex; align-items: center; gap: 0.375rem; color: rgba(255,255,255,0.75);
      text-decoration: none; font-size: 0.875rem; font-weight: 500;
      padding: 0.5rem 0.75rem; border-radius: 0.375rem; transition: all 0.15s ease;
    }
    .cap-header__link:hover { color: #fff; background: rgba(255,255,255,0.1); }
    .cap-header__link--active { color: #fff; background: rgba(255,255,255,0.15); }
    .cap-header__icon { width: 1rem; height: 1rem; flex-shrink: 0; }
    .cap-header__actions { display: flex; align-items: center; gap: 0.375rem; }
    .cap-header__btn {
      display: flex; align-items: center; justify-content: center;
      width: 2.25rem; height: 2.25rem; background: rgba(255,255,255,0.1);
      border: none; border-radius: 0.375rem; color: #fff; cursor: pointer; transition: background 0.15s ease;
    }
    .cap-header__btn:hover { background: rgba(255,255,255,0.2); }
    .cap-header__btn .cap-header__icon { width: 1.125rem; height: 1.125rem; }
    .cap-header__lang {
      display: flex; align-items: center; justify-content: center; height: 2.25rem;
      padding: 0 0.625rem; background: rgba(255,255,255,0.1);
      border: 0.0625rem solid rgba(255,255,255,0.25); border-radius: 0.375rem;
      color: #fff; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.05em;
      cursor: pointer; transition: background 0.15s ease;
    }
    .cap-header__lang:hover { background: rgba(255,255,255,0.2); }
    .cap-header__hamburger {
      display: none; align-items: center; justify-content: center;
      width: 2.25rem; height: 2.25rem; background: none; border: none;
      color: #fff; cursor: pointer; margin-left: auto;
    }
    .cap-header__hamburger svg { width: 1.25rem; height: 1.25rem; }
    @media (max-width: 768px) {
      .cap-header { flex-wrap: wrap; }
      .cap-header__hamburger { display: flex; }
      .cap-header__nav {
        display: none; position: absolute; top: 3.5rem; left: 0; right: 0;
        background: var(--cap-primary, #2a85c4); flex-direction: column;
        padding: 0.5rem 1.5rem 1rem; box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.2); z-index: 100;
      }
      .cap-header__nav--open { display: flex; }
      .cap-header__link { padding: 0.75rem 0; border-bottom: 0.0625rem solid rgba(255,255,255,0.1); }
      .cap-header__link:last-child { border-bottom: none; }
      .cap-header__actions { display: none; }
      .cap-header__actions--open { display: flex; position: static; padding: 0.5rem 0 0; }
    }
  `],
})
export class CapHeaderComponent {
  @Input() brandName = 'CapitalFlow';
  @Input() brandIcon = '';
  @Input() navItems: NavItem[] = [];
  @Input() showThemeToggle = true;
  @Input() showLangSelector = true;
  @Input() currentLang: 'es' | 'en' = 'es';
  @Input() isDark = false;

  @Output() themeToggle = new EventEmitter<void>();
  @Output() langChange = new EventEmitter<'es' | 'en'>();

  menuOpen = false;

  onLangChange(): void {
    const next = this.currentLang === 'es' ? 'en' : 'es';
    this.langChange.emit(next);
  }
}
