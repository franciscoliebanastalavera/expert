import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CapIconComponent } from '../cap-icon/cap-icon.component';

@Component({
  selector: 'cap-metric-card',
  standalone: true,
  imports: [NgClass, NgIf, CapIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-metric-card.component.html',
  styleUrl: './cap-metric-card.component.scss',
})
export class CapMetricCardComponent {
  @Input() iconName: string | null = null;
  @Input() iconSpritePath: string | null = null;
  @Input() value = '';
  @Input() variation = '';
  @Input() title = '';
  @Input() description = '';
  @Input() positive = true;
  @Input() clickable = false;

  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }
}
