import { expect, test } from '@playwright/test';

test('transactions Angular microfrontend renders through its real custom element', async ({ page }) => {
  await page.goto('/transactions');

  const host = page.locator('mfe-transactions');
  await expect(host).toBeVisible();
  await expect(page.getByText('Transacciones')).toBeVisible();
});
