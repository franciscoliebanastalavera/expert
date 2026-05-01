import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

export type CapSpinnerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'cap-spinner',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-spinner.component.html',
  styleUrl: './cap-spinner.component.scss',
})
export class CapSpinnerComponent {
  @Input() label = '';
  @Input() size: CapSpinnerSize = 'medium';
}
