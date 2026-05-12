import { expect, test } from '@playwright/test';

test('exporting transactions to Excel completes without blocking the UI', async ({ page }) => {
  await page.goto('/transactions');

  await expect(page.locator('.subtitle')).toContainText('Virtual Scroll CDK', { timeout: 30_000 });

  const exportButton = page.getByRole('button', { name: 'Exportar Excel' });
  await expect(exportButton).toBeEnabled();

  const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
  await exportButton.click();

  await expect(page.locator('cap-alert')).toContainText('Exportación completada.', {
    timeout: 60_000,
  });

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.(xlsx|csv)$/);
});
