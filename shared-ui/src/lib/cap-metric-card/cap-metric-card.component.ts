import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { CapIconComponent } from '../cap-icon/cap-icon.component';

@Component({
  selector: 'cap-metric-card',
  standalone: true,
  imports: [NgClass, CapIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-metric-card.component.html',
  styleUrl: './cap-metric-card.component.scss',
})
export class CapMetricCardComponent {
  readonly iconName = input<string | null>(null);
  readonly iconSpritePath = input<string | null>(null);
  readonly value = input('');
  readonly variation = input('');
  readonly title = input('');
  readonly description = input('');
  readonly positive = input(true);
  readonly clickable = input(false);

  readonly cardClick = output<void>();

  onClick(): void {
    if (this.clickable()) {
      this.cardClick.emit();
    }
  }
}
