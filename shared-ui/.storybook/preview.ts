import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

const preview: Preview = {
  decorators: [
    (story) => {
      const storyResult = story();
      return {
        ...storyResult,
        template: `<div class="capitalflow-theme" style="padding: 2rem; font-family: 'Segoe UI', sans-serif;">
          ${storyResult.template || '<story/>'}
        </div>`,
      };
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Components', '*'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      options: {
        light: { name: 'Light', value: '#f2f2f2' },
        dark: { name: 'Dark', value: '#121212' },
        white: { name: 'White', value: '#ffffff' },
      },
    },
  },
};

export default preview;
