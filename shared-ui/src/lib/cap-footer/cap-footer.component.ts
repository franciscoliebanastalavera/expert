import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cap-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="cap-footer">
      <span>&copy; {{ year }} {{ companyName }}. Todos los derechos reservados.</span>
      <span class="cap-footer__version">v{{ version }}</span>
    </footer>
  `,
  styles: [`
    .cap-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 3rem;
      padding: 0 1.5rem;
      background: var(--cap-bg-surface, #fff);
      border-top: 0.0625rem solid var(--cap-border, #d4d4d4);
      font-size: 0.75rem;
      color: var(--cap-text-muted, #999);
    }

    .cap-footer__version {
      font-family: monospace;
      font-size: 0.6875rem;
      opacity: 0.7;
    }
  `],
})
export class CapFooterComponent {
  @Input() companyName = 'CapitalFlow';
  @Input() version = '1.0.0';
  @Input() year = new Date().getFullYear();
}
