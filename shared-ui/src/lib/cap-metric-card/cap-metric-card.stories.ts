import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapMetricCardComponent } from './cap-metric-card.component';

const meta: Meta<CapMetricCardComponent> = {
  title: 'Components/CapMetricCard',
  component: CapMetricCardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapMetricCardComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    variation: { control: 'text' },
    description: { control: 'text' },
    iconName: { control: 'text' },
    positive: { control: 'boolean' },
    clickable: { control: 'boolean' },
    cardClick: { action: 'cardClick' },
  },
};

export default meta;
type Story = StoryObj<CapMetricCardComponent>;

export const Positive: Story = {
  args: {
    title: 'Tesorería',
    value: '2.450.000 €',
    variation: '+12.5%',
    description: 'vs. mes anterior',
    iconName: 'trending-up',
    positive: true,
    clickable: false,
  },
};

export const Negative: Story = {
  args: {
    title: 'Gastos operativos',
    value: '387.210 €',
    variation: '-2.1%',
    description: 'vs. trimestre anterior',
    iconName: 'trending-down',
    positive: false,
    clickable: false,
  },
};

export const Clickable: Story = {
  args: {
    title: 'Pagos pendientes',
    value: '24',
    variation: '+3',
    description: 'esta semana',
    iconName: 'alert',
    positive: false,
    clickable: true,
  },
};
