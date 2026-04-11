/**
 * Componente checkbox reutilizable — adaptado de Nter-lib.
 * Selector: 'cap-checkbox'
 */
import { CommonModule } from '@angular/common';
import {
    // ChangeDetectionStrategy,
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
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CapCheckboxComponent),
            multi: true,
        },
    ],
})
export class CapCheckboxComponent {
    /**
     * Name of checkbox
     *
     * @required
     */
    @Input() name: string;

    /**
     * Label of checkbox
     *
     * @required
     */
    @Input() label: string;

    /**
     * State of checkbox
     *
     */
    @Input() checked: boolean;

    /**
     * Checkbox status
     */
    @Input() disabled = false;

    /**
     * Label position
     */
    @Input() labelPosition: 'left' | 'right' = 'right';

    /**
     * Description of checkbox
     */
    @Input() description: string = '';

    /**
     * Description position
     */
    @Input() descriptionPosition: 'bottom' | 'right' = 'bottom';

    /**
     * Output when checkbox value is changed
     */
    @Output() checkboxChange = new EventEmitter<unknown>();

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

    // Alterna el estado del checkbox a partir del evento del DOM
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

    // Callback invocado cuando el valor cambia
    onChange: (value: boolean) => void = () => {};
    // Callback invocado cuando el campo es tocado
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
