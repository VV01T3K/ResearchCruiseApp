import {
  getGetApplicationFormAMockHandler,
  getGetApplicationFormBMockHandler,
  getUpdateApplicationFormBMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { getGetCruiseBlockadesMockHandler } from '@/api/generated/mocks/cruises/cruises.msw.gen';
import { test, expect, applicationForms, fail } from './fixtures';
import { admin } from '../data/accounts';
import { applicationId, formA } from '../data/forms';

test.use({ account: admin });
test.beforeEach(({ network }) => network.use(...applicationForms()));

test('cruise days and hours stay in sync through typing, decimals, steppers and limits', async ({ page, network }) => {
  network.use(
    getGetApplicationFormAMockHandler({
      ...formA(),
      cruiseHours: '48',
      researchTasks: [
        {
          type: '4',
          title: 'Projekt',
          startDate: '2026-09',
          endDate: '2026-10',
          financingAmount: '100',
          securedAmount: '5',
        },
      ],
    })
  );
  await page.goto(`/applications/${applicationId}/formA?mode=edit`);
  const days = page.getByLabel('Liczba planowanych dób rejsowych');
  const hours = page.getByLabel('Liczba planowanych godzin rejsowych');
  // The stepper buttons have no accessible name yet.
  const daysField = page.getByTestId('form-a-cruise-days');
  const hoursField = page.getByTestId('form-a-cruise-hours');
  await expect(days).toHaveValue('2');
  await expect(hours).toHaveValue('48');

  await days.fill('1,');
  await expect(days).toHaveValue('1.');
  await days.press('5');
  await expect(days).toHaveValue('1.5');
  await expect(hours).toHaveValue('36');
  await days.fill('1.257');
  await expect(days).toHaveValue('1.25');
  await expect(hours).toHaveValue('30');
  await hours.fill('7.9');
  await expect(hours).toHaveValue('7');
  await expect(days).toHaveValue('0.29');

  await daysField.getByRole('button').last().click();
  await expect(hours).toHaveValue('31');
  await hoursField.getByRole('button').first().click();
  await expect(hours).toHaveValue('30');
  await hours.fill('');
  await expect(hours).toHaveValue('0');
  await expect(days).toHaveValue('0');

  await days.fill('61');
  await expect(days).toHaveValue('60');
  await hours.fill('1441');
  await expect(hours).toHaveValue('1440');

  const amount = page.locator('input[name="researchTasks[0].financingAmount"]');
  await amount.fill('');
  await amount.blur();
  await expect(amount).toHaveValue('');
  await amount.fill('12,345');
  await amount.blur();
  await expect(amount).toHaveValue('12.35');
});

for (const picker of [
  {
    task: { type: '3', title: 'Projekt', date: '2026-09-01', financingApproved: 'false' },
    field: 'date',
    message: 'Data nie może być pusta',
    option: '15',
  },
  {
    task: {
      type: '4',
      title: 'Projekt',
      startDate: '2026-09-01',
      endDate: '2026-10-01',
      financingAmount: '100',
      securedAmount: '100',
    },
    field: 'startDate',
    message: 'Data rozpoczęcia nie może być pusta',
    option: 'Wrzesień',
  },
]) {
  test(`a cleared research task ${picker.field} is reported on its picker and can be chosen again`, async ({
    page,
    network,
  }) => {
    network.use(getGetApplicationFormAMockHandler({ ...formA(), researchTasks: [picker.task] }));
    await page.goto(`/applications/${applicationId}/formA?mode=edit`);
    const control = page.locator(`button[name="researchTasks[0].${picker.field}"]`);
    await control.getByRole('button').click();
    await page.locator('input[name="researchTasks[0].title"]').click();
    await expect(control).toHaveAttribute('aria-invalid', 'true');
    await expect(control).toHaveAccessibleDescription(new RegExp(picker.message));
    await control.click();
    await page.getByRole('menu').getByRole('button', { name: picker.option, exact: true }).click();
    await expect(page.getByText(picker.message, { exact: true })).toHaveCount(0);
    await expect(control).not.toHaveAttribute('aria-invalid', 'true');
  });
}

test('ship blockades that fail to load are explained on the form', async ({ page, network }) => {
  await page.clock.install();
  network.use(getGetCruiseBlockadesMockHandler(fail(503, { detail: 'Usługa jest chwilowo niedostępna.' })));
  await page.goto(`/applications/${applicationId}/formA?mode=edit`);
  // The query retries with growing delays; advance the clock until it gives up.
  await expect(async () => {
    await page.clock.runFor(5_000);
    await expect(page.getByText('Usługa jest chwilowo niedostępna.')).toBeVisible({ timeout: 100 });
  }).toPass();
});

test('form B shows server errors under row fields and the remaining reasons above the form', async ({
  page,
  network,
}) => {
  const problem = {
    detail: 'Zgłoszenie jest zablokowane.',
    errors: {
      'form.cruiseDaysDetails[0].taskName': ['Nazwa zadania została odrzucona'],
      'form.isCruiseManagerPresent': ['Obecność kierownika została odrzucona'],
      form: ['Nieprawidłowy stan wersji roboczej'],
    },
  };
  network.use(
    getUpdateApplicationFormBMockHandler(fail(400, problem), { once: true }),
    getUpdateApplicationFormBMockHandler()
  );
  await page.goto(`/applications/${applicationId}/formB?mode=edit`);
  await page
    .getByTestId('form-b-cruise-day-details-section')
    .getByRole('button', { name: 'Dodaj', exact: true })
    .click();
  const task = page.getByPlaceholder('Nazwa zadania');
  await task.fill('Niedokończone zadanie');
  await page.getByRole('button', { name: 'Zapisz wersję roboczą', exact: true }).click();

  await expect(task).toHaveAccessibleDescription('Nazwa zadania została odrzucona');
  await expect(
    page.getByRole('checkbox', { name: 'Czy kierownik jest obecny na rejsie?' })
  ).toHaveAccessibleDescription('Obecność kierownika została odrzucona');
  const formErrors = page.getByTestId('form-errors');
  await expect(formErrors).toContainText('Zgłoszenie jest zablokowane.');
  await expect(formErrors).toContainText('Nieprawidłowy stan wersji roboczej');
  await expect(formErrors).not.toContainText('Nazwa zadania została odrzucona');
  await expect(task).toHaveValue('Niedokończone zadanie');

  await page.getByRole('button', { name: 'Zapisz wersję roboczą', exact: true }).click();
  await expect(page.getByText('Formularz został zapisany jako wersja robocza')).toBeVisible();
});

test('form C reports a missing form B as not found', async ({ page, network }) => {
  network.use(getGetApplicationFormBMockHandler(fail(404)));
  await page.goto(`/applications/${applicationId}/formC?mode=edit`);
  await expect(page.getByText('Strona nie znaleziona')).toBeVisible();
});

test('an invalid select keeps its error border while focused', async ({ page, network }) => {
  network.use(getGetApplicationFormAMockHandler({ ...formA(), deputyManagerId: '' }));
  await page.goto(`/applications/${applicationId}/formA?mode=edit`);
  const select = page.getByTestId('form-a-deputy-manager-button');
  await select.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  const errors = page.getByTestId('form-a-deputy-manager-errors');
  await expect(select).toBeFocused();
  await expect(select).toHaveCSS('border-top-color', await errors.evaluate((e) => getComputedStyle(e).color));
});
