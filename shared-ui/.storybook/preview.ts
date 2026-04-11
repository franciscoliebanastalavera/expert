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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f2f2f2' },
        { name: 'dark', value: '#121212' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
