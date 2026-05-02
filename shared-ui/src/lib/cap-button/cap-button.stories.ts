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
    variant: {
      control: 'select',
      options: [
        'primary',
        'primary-contrast',
        'secondary',
        'secondary-contrast',
        'tertiary',
        'tertiary-contrast',
        'toggle',
        'action-primary',
        'action-secondary',
        'circle-primary',
        'circle-secondary',
        'icon-button',
        'capitalflow-primary',
        'capitalflow-secondary',
        'capitalflow-outline',
      ],
    },
    action: { control: 'select', options: [null, 'orange', 'blue', 'pink', 'dark'] },
    size: { control: 'radio', options: ['xsmall', 'small', 'standard'] },
    label: { control: 'text' },
    icon: { control: 'text' },
    iconOrientation: { control: 'radio', options: ['left', 'right'] },
    loading: { control: 'boolean' },
    loadingText: { control: 'text' },
    type: { control: 'radio', options: ['button', 'submit', 'reset'] },
    selected: { control: 'boolean' },
    capClick: { action: 'capClick' },
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

export const Loading: Story = {
  args: { label: 'Procesando', variant: 'primary', size: 'standard', loading: true, loadingText: 'Procesando...' },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <cap-button label="Primary" variant="primary"></cap-button>
        <cap-button label="Secondary" variant="secondary"></cap-button>
        <cap-button label="Tertiary" variant="tertiary"></cap-button>
        <cap-button label="CapitalFlow" variant="capitalflow-primary"></cap-button>
        <cap-button label="Outline" variant="capitalflow-outline"></cap-button>
        <cap-button label="Disabled" variant="primary" [disabled]="true"></cap-button>
        <cap-button label="Small" variant="primary" size="small"></cap-button>
      </div>
    `,
  }),
};
