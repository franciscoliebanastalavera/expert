import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapFooterComponent } from './cap-footer.component';

const meta: Meta<CapFooterComponent> = {
  title: 'Components/CapFooter',
  component: CapFooterComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapFooterComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    copyrightText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CapFooterComponent>;

export const Default: Story = {
  args: { copyrightText: '© 2026 CapitalFlow by Nter. Todos los derechos reservados.' },
};

export const English: Story = {
  args: { copyrightText: '© 2026 CapitalFlow by Nter. All rights reserved.' },
};
