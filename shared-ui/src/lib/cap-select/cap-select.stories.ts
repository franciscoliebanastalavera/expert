import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  },
};

export default meta;
type Story = StoryObj<CapSelectComponent>;

export const Default: Story = {
  args: {
    name: 'currency',
    label: 'Divisa',
    placeholder: 'Selecciona una divisa',
    options: [
      { label: 'Euro (EUR)', value: 'EUR', checked: false },
      { label: 'Dólar (USD)', value: 'USD', checked: false },
      { label: 'Libra (GBP)', value: 'GBP', checked: false },
    ],
  },
};
