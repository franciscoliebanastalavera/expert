import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapAlertComponent } from './cap-alert.component';

const meta: Meta<CapAlertComponent> = {
  title: 'Components/CapAlert',
  component: CapAlertComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapAlertComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'radio', options: ['info', 'success', 'warning', 'danger'] },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CapAlertComponent>;

export const Info: Story = {
  args: {
    kind: 'info',
    message: 'New compliance reporting period opens on 2026-06-01.',
  },
};

export const Success: Story = {
  args: {
    kind: 'success',
    message: 'The script tag was rendered as text — no HTML execution.',
  },
};

export const Warning: Story = {
  args: {
    kind: 'warning',
    message: 'The raw HTML contained an injection vector. It was stripped on save.',
  },
};

export const Danger: Story = {
  args: {
    kind: 'danger',
    message: 'Invalid report URL. Only HTTPS URLs under /reports/ are allowed.',
  },
};
