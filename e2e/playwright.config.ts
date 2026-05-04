import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:8081',
    headless: true,
  },
});
