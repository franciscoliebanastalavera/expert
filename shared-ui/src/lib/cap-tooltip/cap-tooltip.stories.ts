import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapTooltipComponent } from './cap-tooltip.component';

const meta: Meta<CapTooltipComponent> = {
  title: 'Components/CapTooltip',
  component: CapTooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapTooltipComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    titleTooltip: { control: 'text' },
    textTooltip: { control: 'text' },
    tooltipAlign: { control: 'radio', options: ['left', 'center', 'right'] },
    invertVertical: { control: 'boolean' },
    enableTooltipModal: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CapTooltipComponent>;

export const Default: Story = {
  args: {
    titleTooltip: 'IBAN internacional',
    textTooltip: 'Estructura: 2 letras país + 2 dígitos control + número de cuenta nacional.',
    tooltipAlign: 'center',
    invertVertical: false,
    enableTooltipModal: true,
  },
};

export const AlignLeft: Story = {
  args: {
    titleTooltip: 'Concepto',
    textTooltip: 'El concepto aparece en el extracto bancario del receptor.',
    tooltipAlign: 'left',
    invertVertical: false,
    enableTooltipModal: true,
  },
};

export const Inverted: Story = {
  args: {
    titleTooltip: 'Mostrar arriba',
    textTooltip: 'Útil cuando el campo está cerca del borde inferior del viewport.',
    tooltipAlign: 'center',
    invertVertical: true,
    enableTooltipModal: true,
  },
};
