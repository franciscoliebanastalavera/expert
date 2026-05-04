import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapButtonComponent } from '../cap-button/cap-button.component';

@Component({
  selector: 'cap-info-card',
  standalone: true,
  imports: [CommonModule, CapButtonComponent],
  templateUrl: './cap-info-card.component.html',
  styleUrl: './cap-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapInfoCardComponent {
  readonly title = input('');
  readonly description = input('');
  readonly ctaLabel = input('');

  readonly ctaClick = output<void>();

  handleCtaClick(): void {
    this.ctaClick.emit();
  }
}
