import { Meta, StoryObj } from '@storybook/angular';
import { CapButtonComponent } from './cap-button.component';

const meta: Meta<CapButtonComponent> = {
  title: 'Components/CapButton',
  component: CapButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'icon-button'] },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['standard', 'small', 'xsmall'] },
  },
};

export default meta;
type Story = StoryObj<CapButtonComponent>;

export const Primary: Story = {
  args: { label: 'Aceptar', variant: 'primary', disabled: false, size: 'standard' },
};

export const Secondary: Story = {
  args: { label: 'Cancelar', variant: 'secondary', disabled: false },
};

export const Tertiary: Story = {
  args: { label: 'Ver detalles', variant: 'tertiary', disabled: false },
};

export const Disabled: Story = {
  args: { label: 'No disponible', variant: 'primary', disabled: true },
};

export const Small: Story = {
  args: { label: 'Filtrar', variant: 'primary', size: 'small' },
};
