import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapStatusBadgeComponent } from './cap-status-badge.component';

const meta: Meta<CapStatusBadgeComponent> = {
  title: 'Components/CapStatusBadge',
  component: CapStatusBadgeComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapStatusBadgeComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'radio', options: ['success', 'warning', 'info', 'danger', 'neutral'] },
  },
};

export default meta;
type Story = StoryObj<CapStatusBadgeComponent>;

const baseRender = (kind: string, label: string) => ({
  props: { kind },
  template: `<cap-status-badge [kind]="kind">${label}</cap-status-badge>`,
});

export const Success: Story = {
  render: () => baseRender('success', 'Completada'),
  args: { kind: 'success' },
};

export const Warning: Story = {
  render: () => baseRender('warning', 'Pendiente'),
  args: { kind: 'warning' },
};

export const Danger: Story = {
  render: () => baseRender('danger', 'Rechazada'),
  args: { kind: 'danger' },
};

export const Info: Story = {
  render: () => baseRender('info', 'Procesando'),
  args: { kind: 'info' },
};

export const Neutral: Story = {
  render: () => baseRender('neutral', 'Borrador'),
  args: { kind: 'neutral' },
};
