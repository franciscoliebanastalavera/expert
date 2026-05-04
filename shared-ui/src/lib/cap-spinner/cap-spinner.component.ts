import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CapSpinnerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'cap-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-spinner.component.html',
  styleUrl: './cap-spinner.component.scss',
})
export class CapSpinnerComponent {
  readonly label = input('');
  readonly size = input<CapSpinnerSize>('medium');
}
