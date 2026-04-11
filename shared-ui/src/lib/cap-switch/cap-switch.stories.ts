import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapSwitchComponent } from './cap-switch.component';

const meta: Meta<CapSwitchComponent> = {
  title: 'Components/CapSwitch',
  component: CapSwitchComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, CapSwitchComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CapSwitchComponent>;

export const Default: Story = {
  args: { label: 'Modo oscuro' },
};

export const Disabled: Story = {
  args: { label: 'Opción bloqueada', disabled: true },
};
