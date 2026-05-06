import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'number', 'password'] },
    variant: { control: 'select', options: ['standard', 'clear', 'minimal'] },
    size: { control: 'select', options: ['standard', 'small', 'medium'] },
    fontFamily: { control: 'select', options: ['default', 'monospace'] },
    multiline: { control: 'boolean' },
    maxLength: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<CapInputComponent>;

const template = `
    <cap-input
      [name]="name"
      [label]="label"
      [placeholder]="placeholder"
      [helper]="helper"
      [type]="type"
      [variant]="variant"
      [size]="size"
      [fontFamily]="fontFamily"
      [multiline]="multiline"
      [maxLength]="maxLength"
      [customClass]="customClass"
      [formControl]="control">
    </cap-input>
  `;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      customClass: {},
      control: new FormControl({ value: '', disabled: !!args.disabled }),
    },
    template,
  }),
  args: {
    name: 'email',
    label: 'Email',
    placeholder: 'tucorreo@dominio.com',
    helper: '',
    disabled: false,
    type: 'text',
    variant: 'standard',
    size: 'standard',
    multiline: false,
    maxLength: 65,
  },
};

export const Password: Story = {
  render: (args) => ({
    props: {
      ...args,
      customClass: {},
      control: new FormControl({ value: '', disabled: !!args.disabled }),
    },
    template,
  }),
  args: {
    name: 'password',
    label: 'Contraseña',
    placeholder: '********',
    helper: 'Mínimo 8 caracteres con número, mayúscula y minúscula',
    type: 'password',
    variant: 'standard',
    size: 'standard',
    maxLength: 32,
  },
};

export const Multiline: Story = {
  render: (args) => ({
    props: {
      ...args,
      customClass: {},
      control: new FormControl({ value: '', disabled: !!args.disabled }),
    },
    template,
  }),
  args: {
    name: 'comments',
    label: 'Comentarios',
    placeholder: 'Escribe aquí...',
    multiline: true,
    maxLength: 250,
    size: 'standard',
    variant: 'standard',
  },
};

export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      customClass: {},
      control: new FormControl({ value: '', disabled: !!args.disabled }),
    },
    template,
  }),
  args: {
    name: 'iban',
    label: 'IBAN',
    placeholder: 'ES00 0000 0000 0000 0000 0000',
    disabled: true,
    type: 'text',
    variant: 'standard',
    size: 'standard',
  },
};

export const MinimalSmall: Story = {
  render: (args) => ({
    props: {
      ...args,
      customClass: {},
      control: new FormControl({ value: '', disabled: !!args.disabled }),
    },
    template,
  }),
  args: {
    name: 'search',
    placeholder: 'Buscar...',
    type: 'text',
    variant: 'minimal',
    size: 'small',
    fontFamily: 'default',
  },
};

export const MinimalMedium: Story = {
  render: (args) => ({
    props: {
      ...args,
      customClass: {},
      control: new FormControl({ value: '', disabled: !!args.disabled }),
    },
    template,
  }),
  args: {
    name: 'amount',
    placeholder: 'EUR Min',
    type: 'number',
    variant: 'minimal',
    size: 'medium',
    fontFamily: 'default',
  },
};

export const MinimalMonospace: Story = {
  render: (args) => ({
    props: {
      ...args,
      customClass: {},
      control: new FormControl({ value: '', disabled: !!args.disabled }),
    },
    template,
  }),
  args: {
    name: 'url',
    placeholder: 'https://example.com',
    type: 'text',
    variant: 'minimal',
    size: 'small',
    fontFamily: 'monospace',
  },
};
