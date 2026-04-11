import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapInputComponent } from './cap-input.component';

const meta: Meta<CapInputComponent> = {
  title: 'Components/CapInput',
  component: CapInputComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, CapInputComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'select', options: ['text', 'password', 'number', 'email', 'iban'] },
    disabled: { control: 'boolean' },
    size: { control: 'radio', options: ['standard', 'small'] },
  },
};

export default meta;
type Story = StoryObj<CapInputComponent>;

export const Default: Story = {
  args: { label: 'Nombre completo', placeholder: 'Introduce tu nombre', type: 'text' },
};

export const Password: Story = {
  args: { label: 'Contraseña', placeholder: '••••••••', type: 'password' },
};

export const IBAN: Story = {
  args: { label: 'IBAN', placeholder: 'ES00 0000 0000 0000 0000 0000', type: 'iban' },
};

export const Disabled: Story = {
  args: { label: 'Campo deshabilitado', placeholder: 'No editable', disabled: true },
};
