import { expect, test } from '@playwright/test';

test('xss payload does not execute alert in wysiwyg demo', async ({ page }) => {
  let alertFired = false;
  const firedAlerts: string[] = [];

  page.on('dialog', async (dialog) => {
    alertFired = true;
    firedAlerts.push(dialog.message());
    await dialog.dismiss();
  });

  await page.goto('/admin/templates');
  await page.getByRole('button', { name: 'Inject test payload' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);

  expect(alertFired, `Unexpected alert(s) fired: ${firedAlerts.join(', ')}`).toBe(false);
});
