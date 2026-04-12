import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../src/stories/Introduction.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: [
    '../src/assets',
    { from: '../src/assets/images', to: '/images' },
  ],
  webpackFinal: async (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      (warning) =>
        warning.message.includes('DefinePlugin') &&
        warning.message.includes("Conflicting values for 'process.env.NODE_ENV'"),
    ];
    return config;
  },
};

export default config;
