import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapTrendChartComponent } from './cap-trend-chart.component';
import { CapTrendSeries } from './cap-trend-chart.types';

const meta: Meta<CapTrendChartComponent> = {
  title: 'Components/CapTrendChart',
  component: CapTrendChartComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapTrendChartComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CapTrendChartComponent>;

const MONTH_LABELS = ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'];

const INCOME_VS_EXPENSES: readonly CapTrendSeries[] = [
  {
    id: 'income',
    label: 'Ingresos',
    data: [3800, 4100, 4250, 4180, 4350, 4200],
    colorVar: 'var(--cap-primary)',
    fill: true,
  },
  {
    id: 'expenses',
    label: 'Gastos',
    data: [2900, 3050, 2820, 2750, 2680, 2620],
    colorVar: 'var(--cap-warning, #f59e0b)',
    fill: true,
  },
];

const INCOME_ONLY: readonly CapTrendSeries[] = [
  {
    id: 'income',
    label: 'Ingresos',
    data: [3800, 4100, 4250, 4180, 4350, 4200],
    colorVar: 'var(--cap-primary)',
  },
];

export const IncomeVsExpenses: Story = {
  args: {
    title: 'Tendencia mensual',
    labels: MONTH_LABELS,
    series: INCOME_VS_EXPENSES,
  },
};

export const SingleSeries: Story = {
  args: {
    title: 'Solo ingresos',
    labels: MONTH_LABELS,
    series: INCOME_ONLY,
  },
};

export const Empty: Story = {
  args: {
    title: 'Sin datos',
    labels: [],
    series: [],
  },
};
