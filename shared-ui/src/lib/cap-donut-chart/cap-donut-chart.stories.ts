import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapDonutChartComponent } from './cap-donut-chart.component';
import { CapDonutSegment } from './cap-donut-chart.types';

const meta: Meta<CapDonutChartComponent> = {
  title: 'Components/CapDonutChart',
  component: CapDonutChartComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapDonutChartComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CapDonutChartComponent>;

const EXPENSE_SEGMENTS: readonly CapDonutSegment[] = [
  { id: 'housing', label: 'Vivienda', value: 1250, colorVar: 'var(--cap-primary)' },
  { id: 'food', label: 'Alimentación', value: 480, colorVar: 'var(--cap-secondary, #2a85c4)' },
  { id: 'transport', label: 'Transporte', value: 320, colorVar: 'var(--cap-warning, #f59e0b)' },
  { id: 'entertainment', label: 'Ocio', value: 180, colorVar: 'var(--cap-info, #3b82f6)' },
  { id: 'other', label: 'Otros', value: 90, colorVar: 'var(--cap-text-muted, #6b7280)' },
];

export const Default: Story = {
  args: {
    title: 'Gastos por categoría',
    totalLabel: 'Total: 2.320 €',
    data: EXPENSE_SEGMENTS,
  },
};

export const Empty: Story = {
  args: {
    title: 'Sin datos',
    data: [],
  },
};

export const SingleSegment: Story = {
  args: {
    title: 'Única categoría',
    totalLabel: 'Total: 1.000 €',
    data: [{ id: 'only', label: 'Vivienda', value: 1000, colorVar: 'var(--cap-primary)' }],
  },
};
