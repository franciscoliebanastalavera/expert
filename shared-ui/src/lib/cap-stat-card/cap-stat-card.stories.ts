import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapStatCardComponent } from './cap-stat-card.component';

const meta: Meta<CapStatCardComponent> = {
  title: 'Components/CapStatCard',
  component: CapStatCardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapStatCardComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    kind: { control: 'radio', options: ['neutral', 'positive', 'negative'] },
  },
};

export default meta;
type Story = StoryObj<CapStatCardComponent>;

export const Neutral: Story = {
  args: { label: 'Transacciones', value: '120 000', kind: 'neutral' },
};

export const Positive: Story = {
  args: { label: 'Ingresos', value: '1.245.320 €', kind: 'positive' },
};

export const Negative: Story = {
  args: { label: 'Gastos', value: '387.210 €', kind: 'negative' },
};
