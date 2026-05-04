import { NgClass, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
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
    readonly disabled = input(false);
    readonly variant = input<ButtonVariant>('primary');
    readonly action = input<'orange' | 'blue' | 'pink' | 'dark' | null>(null);
    readonly size = input<'xsmall' | 'small' | 'standard'>('standard');
    readonly textStyle = input<'uppercase' | 'capitalize' | 'lowercase' | 'none'>('uppercase');
    readonly label = input<string>('Button');
    readonly icon = input<string | undefined>(undefined);
    readonly iconOrientation = input<'left' | 'right'>('left');
    readonly applyFocus = input(false);
    readonly selected = input(false);
    readonly ariaLabel = input<string | undefined>(undefined);
    readonly ariaDescribedBy = input<string | undefined>(undefined);
    readonly tabIndex = input<number | undefined>(undefined);
    readonly loading = input(false);
    readonly loadingText = input<string | undefined>(undefined);
    readonly type = input<'button' | 'submit' | 'reset'>('button');
    readonly inputButton = input(false);
    readonly width = input<string | undefined>(undefined);
    readonly minWidth = input<string | undefined>(undefined);

    readonly capClick = output<void>();

    readonly iconVariants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'circle-secondary', 'icon-button'];

    readonly notLabelVariants: ButtonVariant[] = ['circle-primary', 'circle-secondary', 'icon-button'];

    readonly buttonClasses = computed(() => {
        const variant = this.variant();
        const classes = ['cap-button', `cap-button__${variant}`, `cap-button__${this.size()}`, `allowfocus-${this.applyFocus()}`];

        if (variant === 'secondary' && this.action()) {
            classes.push(`cap-button__secondary-action-${this.action()}`);
        }

        if (this.selected()) classes.push('selected');
        if (this.inputButton()) classes.push('input-button');

        if (this.loading()) classes.push('cap-button__loading');

        if (this.icon() && this.iconVariants.includes(variant) && !this.notLabelVariants.includes(variant)) {
            classes.push(`cap-button__icon-${this.iconOrientation()}`);
        }

        return classes;
    });

    readonly showIcon = computed(() => !!this.icon() && this.iconVariants.includes(this.variant()));

    readonly showLabel = computed(() => !this.notLabelVariants.includes(this.variant()));

    readonly iconClass = computed(() => {
        if (this.icon() && this.showIcon() && this.showLabel()) {
            return `cap-button__icon-${this.iconOrientation() || ''}`;
        }
        return '';
    });

    handleButton() {
        if (!this.disabled()) {
            this.capClick.emit();
        }
    }
}
