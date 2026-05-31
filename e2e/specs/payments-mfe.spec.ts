import { expect, test } from '@playwright/test';

test('payments Angular microfrontend renders through its real custom element', async ({ page }) => {
  await page.goto('/payments');

  const host = page.locator('mfe-payments');
  await expect(host).toBeVisible();
  // The MFE follows the shell language (English by default); switching is covered separately.
  await expect(page.getByRole('heading', { name: 'International Payments' })).toBeVisible();
});
