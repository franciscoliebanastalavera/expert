import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

const DESKTOP_BREAKPOINT_PX = 768;

@Component({
  selector: 'cap-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-header.component.html',
  styleUrls: ['./cap-header.component.scss'],
})
export class CapHeaderComponent implements OnInit {
  readonly brandName = input('CapitalFlow');
  readonly brandIcon = input('');
  readonly navItems = input<NavItem[]>([]);
  readonly showThemeToggle = input(true);
  readonly showLangSelector = input(true);
  readonly currentLang = input<'es' | 'en'>('es');
  readonly isDark = input(false);

  readonly themeToggle = output<void>();
  readonly langChange = output<'es' | 'en'>();

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  menuOpen = false;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.menuOpen = false;
      });
  }

  onLangChange(): void {
    const next = this.currentLang() === 'es' ? 'en' : 'es';
    this.langChange.emit(next);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen) {
      return;
    }
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.menuOpen = false;
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.menuOpen && window.innerWidth > DESKTOP_BREAKPOINT_PX) {
      this.menuOpen = false;
    }
  }
}
