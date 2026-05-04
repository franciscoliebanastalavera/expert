import { expect, test } from '@playwright/test';

test('shell home loads with the expected header links', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'CapitalFlow' })).toBeVisible();
  await expect(page.locator('.cap-header__link')).toHaveCount(6);
  await expect(page.getByRole('link', { name: 'Design System' })).toBeVisible();
});
