import { expect, test } from '@playwright/test';

test('language toggle swaps shell navigation labels across EN and ES', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Transactions' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Payments' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Transacciones' })).toHaveCount(0);

  const langToggle = page.getByRole('button', { name: 'Change language' });
  await langToggle.click();

  await expect(page.getByRole('link', { name: 'Transacciones' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pagos' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Transactions' })).toHaveCount(0);

  await langToggle.click();
  await expect(page.getByRole('link', { name: 'Transactions' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Transacciones' })).toHaveCount(0);
});
