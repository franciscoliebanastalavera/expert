import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/angular',
    options: {
      enableIvy: true,
      enableNgcc: false,
    },
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
