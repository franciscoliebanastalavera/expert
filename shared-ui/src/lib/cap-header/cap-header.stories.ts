import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapHeaderComponent } from './cap-header.component';

const meta: Meta<CapHeaderComponent> = {
  title: 'Components/CapHeader',
  component: CapHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapHeaderComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    brandName: { control: 'text' },
    showThemeToggle: { control: 'boolean' },
    showLangSelector: { control: 'boolean' },
    currentLang: { control: 'radio', options: ['es', 'en'] },
    isDark: { control: 'boolean' },
    themeToggle: { action: 'themeToggle' },
    langChange: { action: 'langChange' },
  },
};

export default meta;
type Story = StoryObj<CapHeaderComponent>;

export const Default: Story = {
  args: {
    brandName: 'CapitalFlow',
    navItems: [
      { label: 'Inicio', route: '/' },
      { label: 'Analytics', route: '/analytics' },
    ],
    showThemeToggle: true,
    showLangSelector: true,
    currentLang: 'es',
    isDark: false,
  },
};

export const DarkMode: Story = {
  decorators: [
    (story) => {
      const s = story();
      return {
        ...s,
        template: `<div class="capitalflow-theme dark-theme" style="background: #121212; padding: 0;">${s.template || '<story/>'}</div>`,
      };
    },
  ],
  args: {
    ...Default.args,
    isDark: true,
  },
};

export const English: Story = {
  args: {
    ...Default.args,
    currentLang: 'en',
    navItems: [
      { label: 'Home', route: '/' },
      { label: 'Analytics', route: '/analytics' },
    ],
  },
};
