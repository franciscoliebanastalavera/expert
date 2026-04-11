import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapButtonComponent } from './cap-button.component';

const meta: Meta<CapButtonComponent> = {
  title: 'Components/CapButton',
  component: CapButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapButtonComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'icon-button'] },
    size: { control: 'radio', options: ['xsmall', 'small', 'standard'] },
    label: { control: 'text' },
    loading: { control: 'boolean' },
    nterClick: { action: 'nterClick' },
  },
};

export default meta;
type Story = StoryObj<CapButtonComponent>;

export const Primary: Story = {
  args: { label: 'Aceptar', variant: 'primary', size: 'standard', disabled: false },
};

export const Secondary: Story = {
  args: { label: 'Cancelar', variant: 'secondary', size: 'standard', disabled: false },
};

export const Tertiary: Story = {
  args: { label: 'Ver detalles', variant: 'tertiary', size: 'standard', disabled: false },
};

export const Small: Story = {
  args: { label: 'Filtrar', variant: 'primary', size: 'small', disabled: false },
};

export const Disabled: Story = {
  args: { label: 'No disponible', variant: 'primary', size: 'standard', disabled: true },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <cap-button label="Primary" variant="primary"></cap-button>
        <cap-button label="Secondary" variant="secondary"></cap-button>
        <cap-button label="Tertiary" variant="tertiary"></cap-button>
        <cap-button label="Disabled" variant="primary" [disabled]="true"></cap-button>
        <cap-button label="Small" variant="primary" size="small"></cap-button>
      </div>
    `,
  }),
};
