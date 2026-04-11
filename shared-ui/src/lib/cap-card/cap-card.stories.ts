import type { Meta, StoryObj } from '@storybook/angular';
import { CapCardComponent } from './cap-card.component';

const meta: Meta<CapCardComponent> = {
  title: 'Components/CapCard',
  component: CapCardComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['standard', 'small', 'large'] },
  },
};

export default meta;
type Story = StoryObj<CapCardComponent>;

export const Default: Story = {
  args: { size: 'standard' },
  render: (args) => ({
    props: args,
    template: `
      <cap-card [size]="size">
        <h3>Tesorería</h3>
        <p style="font-size: 2rem; font-weight: 700;">€2.450.000</p>
        <p style="color: #2e7d32; font-size: 0.875rem;">+12.5% vs. mes anterior</p>
      </cap-card>
    `,
  }),
};

export const FinancialMetric: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width: 40rem;">
        <cap-card>
          <p style="font-size: 0.75rem; text-transform: uppercase; color: #999;">Ingresos</p>
          <p style="font-size: 1.5rem; font-weight: 700;">€1.245.320</p>
        </cap-card>
        <cap-card>
          <p style="font-size: 0.75rem; text-transform: uppercase; color: #999;">Gastos</p>
          <p style="font-size: 1.5rem; font-weight: 700;">€387.210</p>
        </cap-card>
      </div>
    `,
  }),
};
