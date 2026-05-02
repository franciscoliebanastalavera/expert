import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CapDatepickerComponent } from './cap-datepicker.component';

const meta: Meta<CapDatepickerComponent> = {
  title: 'Components/CapDatepicker',
  component: CapDatepickerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, CapDatepickerComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helper: { control: 'text' },
    size: { control: 'select', options: ['small', 'standard'] },
    today: { control: 'boolean' },
    invertHorizontal: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CapDatepickerComponent>;

const template = `
    <cap-datepicker
      [label]="label"
      [helper]="helper"
      [size]="size"
      [today]="today"
      [invertHorizontal]="invertHorizontal"
      [formControl]="control">
    </cap-datepicker>
  `;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl<Date | null>(null),
    },
    template,
  }),
  args: {
    label: 'Fecha de nacimiento',
    helper: '',
    size: 'small',
    today: false,
    invertHorizontal: false,
  },
};

export const StandardSize: Story = {
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl<Date | null>(null),
    },
    template,
  }),
  args: {
    label: 'Fecha de operación',
    helper: 'Formato dd/mm/aaaa',
    size: 'standard',
    today: true,
    invertHorizontal: false,
  },
};

export const InvertHorizontal: Story = {
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl<Date | null>(null),
    },
    template,
  }),
  args: {
    label: 'Fecha de vencimiento',
    helper: '',
    size: 'small',
    today: false,
    invertHorizontal: true,
  },
};
