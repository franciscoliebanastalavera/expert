import { expect, test } from '@playwright/test';

test('analytics React microfrontend renders through its real custom element', async ({ page }) => {
  await page.goto('/analytics-mfe');

  const host = page.locator('mfe-analytics');
  await expect(host).toBeVisible();
  await expect(page.getByText(/Analytics Dashboard|Dashboard de Analytics/)).toBeVisible();
});
