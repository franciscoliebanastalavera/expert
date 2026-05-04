import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type CapStatCardKind = 'neutral' | 'positive' | 'negative';

@Component({
  selector: 'cap-stat-card',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-stat-card.component.html',
  styleUrl: './cap-stat-card.component.scss',
})
export class CapStatCardComponent {
  readonly label = input('');
  readonly value = input('');
  readonly kind = input<CapStatCardKind>('neutral');
}
