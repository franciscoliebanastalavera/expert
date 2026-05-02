import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapModalComponent } from './cap-modal.component';
import { CapButtonComponent } from '../cap-button/cap-button.component';

const meta: Meta<CapModalComponent> = {
  title: 'Components/CapModal',
  component: CapModalComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapModalComponent, CapButtonComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    showModal: { control: 'boolean' },
    size: { control: 'radio', options: ['small', 'standard', 'large', 'extra-large'] },
    title: { control: 'text' },
    text: { control: 'text' },
    showPrimaryButton: { control: 'boolean' },
    showSecondaryButton: { control: 'boolean' },
    labelPrimaryButton: { control: 'text' },
    labelSecondaryButton: { control: 'text' },
    bgBlocked: { control: 'boolean' },
    image: { control: 'boolean' },
    imageUrl: { control: 'text' },
    tooltipModal: { control: 'boolean' },
    closeModal: { action: 'closeModal' },
    confirm: { action: 'confirm' },
  },
};

export default meta;
type Story = StoryObj<CapModalComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      localShowModal: args.showModal,
      toggleModal: function () {
        this.localShowModal = !this.localShowModal;
      },
    },
    template: `
      <div style="display: flex; justify-content: center; align-items: center; height: 400px; position: relative; z-index: 1;">
        <cap-button label="Abrir Modal" variant="primary" (capClick)="toggleModal()"></cap-button>
        <cap-modal
          [showModal]="localShowModal"
          [size]="size"
          [title]="title"
          [text]="text"
          [showPrimaryButton]="showPrimaryButton"
          [labelPrimaryButton]="labelPrimaryButton"
          [showSecondaryButton]="showSecondaryButton"
          [labelSecondaryButton]="labelSecondaryButton"
          (closeModal)="localShowModal = false"
          (confirm)="localShowModal = false"
        ></cap-modal>
      </div>
    `,
  }),
  args: {
    showModal: false,
    size: 'standard',
    title: 'Confirmar operación',
    text: '¿Está seguro de que desea aprobar esta transferencia de 45.200 €?',
    showPrimaryButton: true,
    labelPrimaryButton: 'Aprobar',
    showSecondaryButton: true,
    labelSecondaryButton: 'Cancelar',
  },
};

export const Small: Story = {
  render: (args) => ({
    props: {
      ...args,
      localShowModal: args.showModal,
      toggleModal: function () {
        this.localShowModal = !this.localShowModal;
      },
    },
    template: `
      <div style="display: flex; justify-content: center; align-items: center; height: 400px; position: relative; z-index: 1;">
        <cap-button label="Abrir Aviso" variant="secondary" (capClick)="toggleModal()"></cap-button>
        <cap-modal
          [showModal]="localShowModal"
          [size]="size"
          [title]="title"
          [text]="text"
          [showPrimaryButton]="showPrimaryButton"
          [labelPrimaryButton]="labelPrimaryButton"
          (closeModal)="localShowModal = false"
          (confirm)="localShowModal = false"
        ></cap-modal>
      </div>
    `,
  }),
  args: {
    showModal: false,
    size: 'small',
    title: 'Aviso',
    text: 'La sesión expirará en 5 minutos.',
    showPrimaryButton: true,
    labelPrimaryButton: 'Entendido',
  },
};

export const BlockingBackground: Story = {
  render: (args) => ({
    props: {
      ...args,
      localShowModal: args.showModal,
      toggleModal: function () {
        this.localShowModal = !this.localShowModal;
      },
    },
    template: `
      <div style="display: flex; justify-content: center; align-items: center; height: 400px; position: relative; z-index: 1;">
        <cap-button label="Abrir Bloqueante" variant="primary" (capClick)="toggleModal()"></cap-button>
        <cap-modal
          [showModal]="localShowModal"
          [size]="size"
          [title]="title"
          [text]="text"
          [bgBlocked]="bgBlocked"
          [showPrimaryButton]="showPrimaryButton"
          [labelPrimaryButton]="labelPrimaryButton"
          (confirm)="localShowModal = false"
        ></cap-modal>
      </div>
    `,
  }),
  args: {
    showModal: false,
    size: 'standard',
    title: 'Operación irreversible',
    text: 'No puede cerrar este aviso pulsando fuera. Confirme para continuar.',
    bgBlocked: true,
    showPrimaryButton: true,
    labelPrimaryButton: 'Confirmar',
  },
};
