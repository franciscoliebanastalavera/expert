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
    checked: { control: 'boolean' },
    labelPosition: { control: 'radio', options: ['left', 'right'] },
    description: { control: 'text' },
    descriptionPosition: { control: 'radio', options: ['bottom', 'right'] },
  },
};

export default meta;
type Story = StoryObj<CapCheckboxComponent>;

export const Default: Story = {
  args: { label: 'Acepto los términos y condiciones', name: 'terms', labelPosition: 'right' },
};

export const Checked: Story = {
  args: { label: 'Recordar sesión', name: 'remember', checked: true, labelPosition: 'right' },
};

export const LabelLeft: Story = {
  args: { label: 'Notificaciones por email', name: 'notify', labelPosition: 'left' },
};

export const WithDescription: Story = {
  args: {
    label: 'Compartir métricas',
    name: 'share',
    description: 'Permitiremos enviar datos agregados anónimos para mejorar el servicio.',
    descriptionPosition: 'bottom',
    labelPosition: 'right',
  },
};

export const Disabled: Story = {
  args: { label: 'Opción no disponible', name: 'blocked', disabled: true },
};
