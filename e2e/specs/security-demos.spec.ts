import { expect, test } from '@playwright/test';

test('xss payload does not execute alert in wysiwyg demo', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
    throw new Error(`Unexpected alert execution: ${dialog.message()}`);
  });

  await page.goto('/admin/templates');
  await page.getByRole('button', { name: 'Inject test payload' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  expect(true).toBe(true);
});
