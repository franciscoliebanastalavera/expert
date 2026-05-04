import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    model,
    output,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'cap-checkbox',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './cap-checkbox.component.html',
    styleUrl: './cap-checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CapCheckboxComponent),
            multi: true,
        },
    ],
})
export class CapCheckboxComponent {
    readonly name = input<string>('');
    readonly label = input<string>('');
    readonly checked = input<boolean>(false);
    readonly disabled = model(false);
    readonly labelPosition = input<'left' | 'right'>('right');
    readonly description = input('');
    readonly descriptionPosition = input<'bottom' | 'right'>('bottom');

    readonly checkboxChange = output<boolean>();

    private innerValue = false;

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.checked() === true) {
                this.writeValue(true);
                this.onChange(true);
            }
        }, 0);
    }

    get value(): boolean {
        return this.innerValue;
    }

    set value(value: boolean) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.onChange(value);
            this.onTouched();
        }
    }

    toggleCheckbox(event: Event) {
        const ischecked = (event.target as HTMLInputElement).checked;
        this.value = ischecked;
        this.onChange(this.value);
        this.checkboxChange.emit(this.value);
    }

    writeValue(value: boolean): void {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    onChange: (value: boolean) => void = () => {};
    onTouched: () => void = () => {};

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled.set(disabled);
    }
}
