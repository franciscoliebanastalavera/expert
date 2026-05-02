import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapInfoCardComponent } from './cap-info-card.component';

const meta: Meta<CapInfoCardComponent> = {
  title: 'Components/CapInfoCard',
  component: CapInfoCardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapInfoCardComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    ctaLabel: { control: 'text' },
    ctaClick: { action: 'ctaClick' },
  },
};

export default meta;
type Story = StoryObj<CapInfoCardComponent>;

export const Default: Story = {
  args: {
    title: 'WYSIWYG editor',
    description:
      'Stored XSS via report templates. Quill 2 + DOMPurify strip script tags, onerror handlers and javascript: URLs from administrator-authored content.',
    ctaLabel: 'Open demo',
  },
};

export const Grid: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem;">
        <cap-info-card title="WYSIWYG editor" description="Stored XSS demo." ctaLabel="Open"></cap-info-card>
        <cap-info-card title="PDF viewer" description="Iframe URL allowlist." ctaLabel="Open"></cap-info-card>
        <cap-info-card title="Document uploads" description="Filename escaping." ctaLabel="Open"></cap-info-card>
        <cap-info-card title="Reflected search" description="innerText binding." ctaLabel="Open"></cap-info-card>
      </div>
    `,
  }),
};
