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
};

export default meta;
type Story = StoryObj<CapCardComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <cap-card>
        <h3 style="margin: 0 0 0.5rem; color: var(--cap-text, #1e1e1e);">Tesorería</h3>
        <p style="font-size: 2rem; font-weight: 700; margin: 0; color: var(--cap-text, #1e1e1e);">€2.450.000</p>
        <p style="color: #2e7d32; font-size: 0.875rem; margin: 0.5rem 0 0;">+12.5% vs. mes anterior</p>
      </cap-card>
    `,
  }),
};

export const FinancialGrid: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width: 40rem;">
        <cap-card>
          <p style="font-size: 0.75rem; text-transform: uppercase; color: var(--cap-text-muted, #999); margin: 0 0 0.25rem;">Ingresos</p>
          <p style="font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--cap-text, #1e1e1e);">€1.245.320</p>
        </cap-card>
        <cap-card>
          <p style="font-size: 0.75rem; text-transform: uppercase; color: var(--cap-text-muted, #999); margin: 0 0 0.25rem;">Gastos</p>
          <p style="font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--cap-text, #1e1e1e);">€387.210</p>
        </cap-card>
      </div>
    `,
  }),
};
