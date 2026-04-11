import { Meta, StoryObj } from '@storybook/angular';
import { CapModalComponent } from './cap-modal.component';

const meta: Meta<CapModalComponent> = {
  title: 'Components/CapModal',
  component: CapModalComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CapModalComponent>;

export const Default: Story = {
  args: {
    showModal: true,
    title: 'Confirmar operación',
    text: '¿Está seguro de que desea aprobar esta transferencia de €45.200?',
    size: 'standard',
    showPrimaryButton: true,
    showSecondaryButton: true,
    labelPrimaryButton: 'Aprobar',
    labelSecondaryButton: 'Cancelar',
  },
};

export const Small: Story = {
  args: {
    showModal: true,
    title: 'Aviso',
    text: 'La sesión expirará en 5 minutos.',
    size: 'small',
    showPrimaryButton: true,
    labelPrimaryButton: 'Entendido',
  },
};
