import { expect, test } from '@playwright/test';

// Regression guard for the language contract: the payments and transactions
// MFEs are loaded as custom elements and must follow the shell language, which
// the shell reflects on <html lang>. The MFEs observe it and re-render.
test('payments and transactions MFEs follow the shell language toggle', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Change language' });

  // Payments: English default -> toggle -> Spanish
  await page.goto('/payments');
  await expect(page.getByRole('heading', { name: 'International Payments' })).toBeVisible({
    timeout: 30_000,
  });
  await toggle.click();
  await expect(page.getByRole('heading', { name: 'Pagos Internacionales' })).toBeVisible();

  // Transactions: language persisted as Spanish across navigation -> toggle -> English
  await page.goto('/transactions');
  await expect(page.getByRole('heading', { name: 'Transacciones' })).toBeVisible({
    timeout: 30_000,
  });
  await toggle.click();
  await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
});
