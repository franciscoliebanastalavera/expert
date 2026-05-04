import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type CapStatusBadgeKind = 'success' | 'warning' | 'info' | 'danger' | 'neutral';

@Component({
  selector: 'cap-status-badge',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-status-badge.component.html',
  styleUrl: './cap-status-badge.component.scss',
})
export class CapStatusBadgeComponent {
  readonly kind = input<CapStatusBadgeKind>('neutral');
}
