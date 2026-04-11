import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapCheckboxComponent } from './cap-checkbox.component';

const meta: Meta<CapCheckboxComponent> = {
  title: 'Components/CapCheckbox',
  component: CapCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, CapCheckboxComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CapCheckboxComponent>;

export const Default: Story = {
  args: { label: 'Acepto los términos y condiciones', name: 'terms' },
};

export const Disabled: Story = {
  args: { label: 'Opción no disponible', name: 'blocked', disabled: true },
};
