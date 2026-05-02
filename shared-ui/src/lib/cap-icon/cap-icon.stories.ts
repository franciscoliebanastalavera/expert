import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapIconComponent } from './cap-icon.component';

const meta: Meta<CapIconComponent> = {
  title: 'Components/CapIcon',
  component: CapIconComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapIconComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    spritePath: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CapIconComponent>;

export const Default: Story = {
  args: { name: 'home' },
};

export const Settings: Story = {
  args: { name: 'settings' },
};

export const IconGrid: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; font-size: 1.5rem;">
        <cap-icon name="home"></cap-icon>
        <cap-icon name="settings"></cap-icon>
        <cap-icon name="user"></cap-icon>
        <cap-icon name="search"></cap-icon>
      </div>
    `,
  }),
};
