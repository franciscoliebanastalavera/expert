import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapHeaderComponent } from './cap-header.component';

const meta: Meta<CapHeaderComponent> = {
  title: 'Components/CapHeader',
  component: CapHeaderComponent,
  decorators: [
    applicationConfig({ providers: [provideRouter([{ path: '**', children: [] }])] }),
    moduleMetadata({ imports: [CommonModule, CapHeaderComponent] }),
  ],
  argTypes: {
    brandName: { control: 'text' },
    navItem1Label: { control: 'text', description: 'Label nav item 1' },
    navItem2Label: { control: 'text', description: 'Label nav item 2' },
    navItem3Label: { control: 'text', description: 'Label nav item 3' },
    showThemeToggle: { control: 'boolean' },
    showLangSelector: { control: 'boolean' },
    currentLang: { control: 'radio', options: ['es', 'en'] },
    isDark: { control: 'boolean' },
    navItems: { table: { disable: true } },
    themeToggle: { table: { disable: true } },
    langChange: { table: { disable: true } },
  },
};
export default meta;
type Story = StoryObj<CapHeaderComponent>;

const defaultRender = (args: Record<string, unknown>) => ({
  props: {
    ...args,
    navItems: [
      { label: args['navItem1Label'] || 'Inicio', route: '/home' },
      { label: args['navItem2Label'] || 'Analytics', route: '/analytics' },
      { label: args['navItem3Label'] || 'Analytics MFE', route: '/analytics-mfe' },
    ],
  },
  template: `
    <cap-header
      [brandName]="brandName"
      [navItems]="navItems"
      [isDark]="isDark"
      [currentLang]="currentLang"
      [showThemeToggle]="showThemeToggle"
      [showLangSelector]="showLangSelector">
    </cap-header>
  `,
});

export const Default: Story = {
  args: {
    brandName: 'CapitalFlow',
    navItem1Label: 'Inicio',
    navItem2Label: 'Analytics',
    navItem3Label: 'Analytics MFE',
    isDark: false,
    currentLang: 'es',
    showThemeToggle: true,
    showLangSelector: true,
  },
  render: defaultRender,
};

export const DarkMode: Story = {
  args: {
    brandName: 'CapitalFlow',
    navItem1Label: 'Inicio',
    navItem2Label: 'Analytics',
    navItem3Label: 'Analytics MFE',
    isDark: true,
    currentLang: 'es',
    showThemeToggle: true,
    showLangSelector: true,
  },
  render: defaultRender,
};

export const English: Story = {
  args: {
    brandName: 'CapitalFlow',
    navItem1Label: 'Home',
    navItem2Label: 'Analytics',
    navItem3Label: 'Analytics MFE',
    isDark: false,
    currentLang: 'en',
    showThemeToggle: true,
    showLangSelector: true,
  },
  render: defaultRender,
};
