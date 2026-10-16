import { test, expect, mockApplicationForms } from './fixtures';
import { admin } from '../data/accounts';
import { applicationId, filledFormA, filledFormB, filledFormC } from '../data/forms';

test.use({ account: admin });

// Forms saved with every section filled must display and resubmit without changes: loading
// a saved form has shifted periods and dates and sent malformed data before.
const forms = [
  { name: 'A', path: 'formA', saved: filledFormA, shown: ['Instytut Morski', 'Rynna Słupska', 'Wniosek NCN'] },
  { name: 'B', path: 'formB', saved: filledFormB, shown: ['Sonda CTD', 'ABC123', 'Echosonda'] },
  { name: 'C', path: 'formC', saved: filledFormC, shown: ['Woda', 'Raport SPUB', 'zdjecie.jpg'] },
] as const;

for (const { name, path, saved, shown } of forms) {
  test(`a completely filled form ${name} is shown read-only and resubmitted unchanged`, async ({ page, api }) => {
    await mockApplicationForms(api);
    await api('GET', `/v2/applications/${applicationId}/form-${name.toLowerCase()}`, (route) =>
      route.fulfill({ json: saved() })
    );
    let submitted: unknown;
    await api('PUT', `/v2/applications/${applicationId}/form-${name.toLowerCase()}`, async (route) => {
      submitted = route.request().postDataJSON();
      await route.fulfill({ status: 204 });
    });

    await page.goto(`/applications/${applicationId}/${path}?mode=view`);
    // Read-only fields keep their value in disabled inputs, so match either the text or the value.
    for (const text of shown) {
      await expect(
        page
          .getByText(text, { exact: true })
          .or(page.locator(`[value="${text}"]`))
          .first()
      ).toBeAttached();
    }
    await expect(page.getByRole('button', { name: 'Wyślij', exact: true })).toHaveCount(0);

    await page.goto(`/applications/${applicationId}/${path}?mode=edit`);
    await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
    await expect.poll(() => submitted).toBeDefined();
    expect(submitted).toEqual({ draft: false, form: saved() });
  });
}
