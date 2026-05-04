import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, input, model } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cap-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-tab.component.html',
  styleUrls: ['./cap-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapTabComponent),
      multi: true,
    },
  ],
})
export class CapTabComponent {
  readonly label = input<string>('');
  readonly active = model(false);
  readonly disabled = input(false);
}
