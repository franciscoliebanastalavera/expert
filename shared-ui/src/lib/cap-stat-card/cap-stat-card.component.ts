import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input() label = '';
  @Input() value = '';
  @Input() kind: CapStatCardKind = 'neutral';
}
