import { NgClass, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PipesModule } from '../core/pipes/pipes.module';
import { ButtonVariant } from '../core/types/components.types';

@Component({
    selector: 'cap-button',
    standalone: true,
    imports: [NgClass, PipesModule, CommonModule],
    templateUrl: './cap-button.component.html',
    styleUrl: './cap-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapButtonComponent {
    @Input() disabled: boolean = false;

    @Input() variant: ButtonVariant = 'primary';

    @Input() action: 'orange' | 'blue' | 'pink' | 'dark' | null = null;

    @Input() size: 'xsmall' | 'small' | 'standard' = 'standard';

    @Input() textStyle: 'uppercase' | 'capitalize' | 'lowercase' | 'none' = 'uppercase';

    @Input() label: string = 'Button';

    @Input() icon?: string;

    @Input() iconOrientation: 'left' | 'right' = 'left';

    @Input() applyFocus: boolean = false;

    @Input() selected = false;

    @Input() ariaLabel?: string;
    @Input() ariaDescribedBy?: string;
    @Input() tabIndex?: number;

    @Input() loading: boolean = false;
    @Input() loadingText?: string;

    @Input() type: 'button' | 'submit' | 'reset' = 'button';

    @Input() inputButton: boolean = false;

    @Input() width?: string;

    @Input() minWidth?: string;

    @Output() capClick = new EventEmitter();

    readonly iconVariants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'circle-secondary', 'icon-button'];

    readonly notLabelVariants: ButtonVariant[] = ['circle-primary', 'circle-secondary', 'icon-button'];

    get buttonClasses(): string[] {
        const classes = ['cap-button', `cap-button__${this.variant}`, `cap-button__${this.size}`, `allowfocus-${this.applyFocus}`];

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

    get showIcon(): boolean {
        return !!this.icon && this.iconVariants.includes(this.variant);
    }

    get showLabel(): boolean {
        return !this.notLabelVariants.includes(this.variant);
    }

    get iconClass(): string {
        if (this.icon && this.showIcon && this.showLabel) {
            return `cap-button__icon-${this.iconOrientation || ''}`;
        }
        return '';
    }

    handleButton() {
        !this.disabled && this.capClick.emit();
    }
}
