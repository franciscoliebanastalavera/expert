import type { Meta, StoryObj } from '@storybook/angular';
import { CapModalComponent } from './cap-modal.component';

const meta: Meta<CapModalComponent> = {
  title: 'Components/CapModal',
  component: CapModalComponent,
  tags: ['autodocs'],
  argTypes: {
    showModal: { control: 'boolean' },
    title: { control: 'text' },
    text: { control: 'text' },
    size: { control: 'select', options: ['small', 'standard', 'large', 'extra-large'] },
    showPrimaryButton: { control: 'boolean' },
    showSecondaryButton: { control: 'boolean' },
    labelPrimaryButton: { control: 'text' },
    labelSecondaryButton: { control: 'text' },
  },
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

export const Large: Story = {
  args: {
    showModal: true,
    title: 'Detalle de transacción',
    text: 'Transferencia SEPA completada el 11/04/2026. IBAN destino: ES91 2100 0418 4502 0005 1332. Importe: €15.200,00.',
    size: 'large',
    showPrimaryButton: true,
    showSecondaryButton: true,
    labelPrimaryButton: 'Descargar PDF',
    labelSecondaryButton: 'Cerrar',
  },
};
