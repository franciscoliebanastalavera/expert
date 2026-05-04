import { expect, test } from '@playwright/test';

test('payments Angular microfrontend renders through its real custom element', async ({ page }) => {
  await page.goto('/payments-mfe');

  const host = page.locator('mfe-payments');
  await expect(host).toBeVisible();
  await expect(page.getByText('Pagos Internacionales')).toBeVisible();
});
