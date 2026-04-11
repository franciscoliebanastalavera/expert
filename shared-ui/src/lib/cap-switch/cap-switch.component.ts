import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
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
  @Input() checked = false;

  @Input() label = '';

  @Input() labelColor: 'black' | 'white' = 'black';

  @Input() labelWeight: 'normal' | 'bold' = 'normal';

  @Input() disabled = false;

  @Output() switchChange = new EventEmitter<boolean>();

  controlId = `cap-switch-${Math.random().toString(36).substring(2)}`;

  onChange = (_: boolean): void => {};

  onTouch = (): void => {};

  handleChange(checked: boolean): void {
    this.checked = checked;
    this.onTouch();
    this.onChange(this.checked);
    this.switchChange.emit(checked);
  }

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (_: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }
}
