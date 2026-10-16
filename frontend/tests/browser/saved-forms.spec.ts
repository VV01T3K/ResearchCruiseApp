import {
  getGetApplicationFormAMockHandler,
  getGetApplicationFormBMockHandler,
  getGetApplicationFormCMockHandler,
  getUpdateApplicationFormAMockHandler,
  getUpdateApplicationFormBMockHandler,
  getUpdateApplicationFormCMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { test, expect, applicationForms } from './fixtures';
import { admin } from '../data/accounts';
import { applicationId, filledFormA, filledFormB, filledFormC } from '../data/forms';

test.use({ account: admin });

// Forms saved with every section filled must display and resubmit without changes: loading
// a saved form has shifted periods and dates and sent malformed data before.
const forms = [
  {
    name: 'A',
    saved: filledFormA(),
    handlers: [getGetApplicationFormAMockHandler(filledFormA()), getUpdateApplicationFormAMockHandler()],
    shown: ['Instytut Morski', 'Rynna Słupska', 'Wniosek NCN'],
  },
  {
    name: 'B',
    saved: filledFormB(),
    handlers: [getGetApplicationFormBMockHandler(filledFormB()), getUpdateApplicationFormBMockHandler()],
    shown: ['Sonda CTD', 'ABC123', 'Echosonda'],
  },
  {
    name: 'C',
    saved: filledFormC(),
    handlers: [getGetApplicationFormCMockHandler(filledFormC()), getUpdateApplicationFormCMockHandler()],
    shown: ['Woda', 'Raport SPUB', 'zdjecie.jpg'],
  },
];

for (const { name, saved, handlers, shown } of forms) {
  test(`a completely filled form ${name} is shown read-only and resubmitted unchanged`, async ({
    page,
    network,
    requests,
  }) => {
    // Earlier handlers take precedence, so the filled form replaces the default one.
    network.use(...handlers, ...applicationForms());
    const form = `/applications/${applicationId}/form${name}`;

    await page.goto(`${form}?mode=view`);
    // Read-only fields keep their value in disabled inputs, so match either the text or the value.
    for (const text of shown) {
      await expect(
        page
          .getByText(text, { exact: true })
          .or(page.locator(`[value="${text}"]`))
          .first()
      ).toBeVisible();
    }
    await expect(page.getByRole('textbox', { disabled: false })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Wyślij', exact: true })).toHaveCount(0);

    await page.goto(`${form}?mode=edit`);
    await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
    const route = `PUT /v2/applications/${applicationId}/form-${name.toLowerCase()}`;
    await expect.poll(() => requests.bodies(route)).toEqual([{ draft: false, form: saved }]);
  });
}
