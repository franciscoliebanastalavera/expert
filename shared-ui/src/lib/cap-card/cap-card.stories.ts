import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapCardComponent } from './cap-card.component';

const meta: Meta<CapCardComponent> = {
  title: 'Components/CapCard',
  component: CapCardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapCardComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    content: { control: 'text' },
    type: { control: 'radio', options: ['primary', 'secondary'] },
    borderRadius: { control: 'text' },
    customStyle: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CapCardComponent>;

export const Default: Story = {
  args: {
    title: 'Tesorería',
    subtitle: '2.450.000 €',
    content: '+12.5% vs. mes anterior',
    type: 'primary',
    borderRadius: '20px',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Liquidez',
    subtitle: '987.430 €',
    content: 'Disponibilidad inmediata',
    type: 'secondary',
    borderRadius: '20px',
  },
};

export const FinancialGrid: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width: 40rem;">
        <cap-card title="Ingresos" subtitle="1.245.320 €" content="+8.4%" type="primary"></cap-card>
        <cap-card title="Gastos" subtitle="387.210 €" content="-2.1%" type="secondary"></cap-card>
      </div>
    `,
  }),
};
