import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cap-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="cap-footer">
      <span>{{ copyrightText }}</span>
    </footer>
  `,
  styles: [`
    .cap-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 3rem;
      padding: 0 1.5rem;
      background: var(--cap-primary, #2a85c4);
      font-size: 0.875rem;
      color: #ffffff;
    }
  `],
})
export class CapFooterComponent {
  @Input() copyrightText = '© 2026 CapitalFlow by Nter.';
}
