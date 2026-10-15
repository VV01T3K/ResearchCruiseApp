import { expect, test } from '@playwright/test';

const examples = [
  ['table', 'core-components-table-apptable--default', 'John Smith'],
  ['validation-errors', 'validation-form-validation--with-invalid-data', 'Name is required'],
  ['open-modal', 'core-components-appmodal--open', 'Modal'],
  ['files', 'core-components-inputs-parts-appfilelist--default', 'File 2'],
] as const;

for (const [name, id, readyText] of examples) {
  test(name, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await expect(page.getByText(readyText, { exact: true })).toBeVisible();
    await expect(page.locator('#storybook-root')).not.toBeEmpty();
    await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
    // Arial maps to Liberation Sans on Linux, keeping the baselines portable across CI and local runs.
    await page.addStyleTag({ content: 'html { font-family: Arial, sans-serif; }' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => {})));
    });
    await expect(page).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}
