import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CapSelectComponent } from './cap-select.component';

const meta: Meta<CapSelectComponent> = {
  title: 'Components/CapSelect',
  component: CapSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, CapSelectComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    options: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<CapSelectComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl({ value: null, disabled: !!args.disabled }),
    },
    template: `
      <cap-select
        [name]="name"
        [label]="label"
        [placeholder]="placeholder"
        [options]="options"
        [formControl]="control">
      </cap-select>
    `,
  }),
  args: {
    name: 'currency',
    label: 'Divisa',
    placeholder: 'Selecciona una divisa',
    disabled: false,
    options: [
      { label: 'Euro (EUR)', value: 'EUR', checked: false },
      { label: 'Dólar (USD)', value: 'USD', checked: false },
      { label: 'Libra (GBP)', value: 'GBP', checked: false },
    ],
  },
};
