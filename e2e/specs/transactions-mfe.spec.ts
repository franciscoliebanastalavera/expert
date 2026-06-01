import { expect, test } from '@playwright/test';

test('transactions Angular microfrontend renders through its real custom element', async ({ page }) => {
  await page.goto('/transactions');

  const host = page.locator('mfe-transactions');
  await expect(host).toBeVisible();
  // The MFE follows the shell language (English by default); switching is covered separately.
  await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
});
