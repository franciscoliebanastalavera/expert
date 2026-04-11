/**
 * Componente de boton reutilizable — adaptado de Nter-lib.
 * Selector: 'cap-button'
 */
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PipesModule } from '../core/pipes/pipes.module';
import { ButtonVariant } from '../core/types/components.types';

@Component({
    selector: 'cap-button',
    standalone: true,
    imports: [NgClass, PipesModule],
    templateUrl: './cap-button.component.html',
    styleUrl: './cap-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapButtonComponent {
    /**
     * Button status. If optional event "capClick" is defined, only runs when this parameters is false.
     */
    @Input() disabled: boolean = false;

    /**
     * Button style based in its variant
     */
    @Input() variant: ButtonVariant = 'primary';

    /**
     * Button action color
     */
    @Input() action: 'orange' | 'blue' | 'pink' | 'dark' | null = null;

    /**
     * How large should the button be?
     */
    @Input() size: 'xsmall' | 'small' | 'standard' = 'standard';

    /**
     * Button text style
     */
    @Input() textStyle: 'uppercase' | 'capitalize' | 'lowercase' | 'none' = 'uppercase';

    /**
     * Button contents
     *
     * @required
     */
    @Input() label: string = 'Button';

    /**
     * Optional button icon
     * IMPORTANT: Use a SVG resource so the icon color change automatically depending on its state
     */
    @Input() icon?: string;

    /**
     * Optional button icon orientation
     */
    @Input() iconOrientation: 'left' | 'right' = 'left';

    /**
     * Apply styles when button is focused
     */
    @Input() applyFocus: boolean = false;

    /**
     * Show button as selected
     */
    @Input() selected = false;

    /**
     * ARIA attributes for accessibility
     */
    @Input() ariaLabel?: string;
    @Input() ariaDescribedBy?: string;
    @Input() tabIndex?: number;

    /**
     * Loading state
     */
    @Input() loading: boolean = false;
    @Input() loadingText?: string;

    /**
     * Type attribute for <button> HTML tag
     */
    @Input() type: 'button' | 'submit' | 'reset' = 'button';

    /**
     * Optional custom hover to input buttons.
     */
    @Input() inputButton: boolean = false;

    /**
     * Optional custom width. You can set any valid CSS value
     */
    @Input() width?: string;

    /**
     * Optional custom min-width. You can set any valid CSS value
     */
    @Input() minWidth?: string;

    /**
     * Optional event click. This event only runs when the parameter "disabled" is false
     */
    @Output() capClick = new EventEmitter();

    /**
     * Button variants that allow showing an icon
     */
    readonly iconVariants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'circle-secondary', 'icon-button'];

    /**
     * Button variants that don't allow showing a label
     */
    readonly notLabelVariants: ButtonVariant[] = ['circle-primary', 'circle-secondary', 'icon-button'];

    /**
     * Button CSS classes to use depending on the component parameters
     */
    get buttonClasses(): string[] {
        const classes = ['cap-button', `cap-button__${this.variant}`, `cap-button__${this.size}`, `allowfocus-${this.applyFocus}`];

        // Añadimos clase especial solo si es secondary + action
        if (this.variant === 'secondary' && this.action) {
            classes.push(`cap-button__secondary-action-${this.action}`);
        }

        if (this.selected) classes.push('selected');
        if (this.inputButton) classes.push('input-button');

        if (this.loading) classes.push('cap-button__loading');

        if (this.icon && this.iconVariants.includes(this.variant) && !this.notLabelVariants.includes(this.variant)) {
            classes.push(`cap-button__icon-${this.iconOrientation}`);
        }

        return classes;
    }

    handleButton() {
        !this.disabled && this.capClick.emit();
    }
}
