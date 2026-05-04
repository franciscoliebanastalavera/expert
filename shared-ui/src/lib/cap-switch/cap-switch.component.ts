import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cap-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-switch.component.html',
  styleUrl: './cap-switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapSwitchComponent),
      multi: true,
    },
  ],
})
export class CapSwitchComponent {
  readonly checked = model(false);
  readonly label = input('');
  readonly labelColor = input<'black' | 'white'>('black');
  readonly labelWeight = input<'normal' | 'bold'>('normal');
  readonly disabled = model(false);

  readonly switchChange = output<boolean>();

  controlId = `cap-switch-${Math.random().toString(36).substring(2)}`;

  onChange = (_: boolean): void => {};

  onTouch = (): void => {};

  handleChange(checked: boolean): void {
    this.checked.set(checked);
    this.onTouch();
    this.onChange(this.checked());
    this.switchChange.emit(checked);
  }

  writeValue(value: boolean): void {
    this.checked.set(value);
  }

  registerOnChange(fn: (_: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
