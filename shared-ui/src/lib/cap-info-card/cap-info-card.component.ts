import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() ctaLabel: string = '';

  @Output() ctaClick = new EventEmitter<void>();

  handleCtaClick(): void {
    this.ctaClick.emit();
  }
}
