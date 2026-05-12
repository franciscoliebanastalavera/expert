import { expect, test } from '@playwright/test';

test('transactions search filter narrows the visible row count', async ({ page }) => {
  await page.goto('/transactions');

  const subtitle = page.locator('.subtitle');
  await expect(subtitle).toContainText('Virtual Scroll CDK', { timeout: 30_000 });

  const filteredCard = page.locator('cap-stat-card').filter({ hasText: 'Filas filtradas' });
  await expect(filteredCard).toBeVisible();
  const initialFilteredText = (await filteredCard.innerText()).replace(/\s+/g, ' ').trim();

  const searchInput = page.locator('cap-input[formcontrolname="texto"] input');
  await searchInput.fill('SEPA');

  await expect.poll(async () => (await filteredCard.innerText()).replace(/\s+/g, ' ').trim(), {
    timeout: 10_000,
  }).not.toBe(initialFilteredText);

  await page.getByRole('button', { name: 'Limpiar' }).click();
  await expect.poll(async () => (await filteredCard.innerText()).replace(/\s+/g, ' ').trim(), {
    timeout: 10_000,
  }).toBe(initialFilteredText);
});
