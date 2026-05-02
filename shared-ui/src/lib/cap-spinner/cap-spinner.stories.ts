import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapSpinnerComponent } from './cap-spinner.component';

const meta: Meta<CapSpinnerComponent> = {
  title: 'Components/CapSpinner',
  component: CapSpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapSpinnerComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
  },
};

export default meta;
type Story = StoryObj<CapSpinnerComponent>;

export const Default: Story = {
  args: { label: 'Cargando...', size: 'medium' },
};

export const Small: Story = {
  args: { label: '', size: 'small' },
};

export const Large: Story = {
  args: { label: 'Procesando 120 000 transacciones', size: 'large' },
};
