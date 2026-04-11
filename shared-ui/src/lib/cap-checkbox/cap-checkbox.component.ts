import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    Output,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'cap-checkbox',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './cap-checkbox.component.html',
    styleUrl: './cap-checkbox.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CapCheckboxComponent),
            multi: true,
        },
    ],
})
export class CapCheckboxComponent {
    @Input() name: string;

    @Input() label: string;

    @Input() checked: boolean;

    @Input() disabled = false;

    @Input() labelPosition: 'left' | 'right' = 'right';

    @Input() description: string = '';

    @Input() descriptionPosition: 'bottom' | 'right' = 'bottom';

    @Output() checkboxChange = new EventEmitter<boolean>();

    private innerValue = false;

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.checked === true) {
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
        this.disabled = disabled;
    }
}
