import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapHeaderComponent } from './cap-header.component';

const meta: Meta<CapHeaderComponent> = {
  title: 'Components/CapHeader',
  component: CapHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [CommonModule, CapHeaderComponent],
    }),
  ],
  tags: ['autodocs'],
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

export const Default: Story = {};

export const DarkMode: Story = {
  args: { isDark: true },
};

export const English: Story = {
  args: {
    currentLang: 'en',
    navItems: [
      { label: 'Home', route: '/' },
      { label: 'Analytics', route: '/analytics' },
    ],
  },
};
