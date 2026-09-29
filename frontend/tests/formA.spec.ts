import { expect } from '@playwright/test';

import { MOCK_PDF_FILEPATH } from './fixtures/consts';
import { getFormAPayload } from './fixtures/mockPayloads';
import { API_URL, formTest as test } from './fixtures/fixtures';
import { type FormAPage } from './fixtures/pages/formA/formAPage';
import { touchInput } from './utils/form-filling-utils';

type FormASection = keyof FormAPage['sections'];

/**
 * Section → the form fields that must report an error when that section is invalid.
 *
 * Only field-level (object shape) rules can appear here. Zod skips `.superRefine` when the
 * object shape itself fails, so cross-field rules — the `cruiseHours` cruise-duration check
 * among them — never fire for a payload that also blanks a field-level one such as
 * `shipUsage`. Those rules are covered in `formA.schema.test.ts` instead.
 */
const REQUIRED_SECTION_FIELDS = {
  cruiseManagerInfoSection: ['deputyManagerId'],
  cruiseLengthSection: ['shipUsage'],
  researchAreaSection: ['researchAreaDescriptions'],
  cruiseGoalSection: ['cruiseGoal'],
  researchTasksSection: ['researchTasks'],
  membersSection: ['ugTeams'],
  supervisorInfoSection: ['supervisorEmail'],
} as const;

/** Section → fields that must report an error when the section holds a row of invalid data. */
const INVALID_ROW_SECTION_FIELDS = {
  permissionsSection: ['permissions'],
  researchAreaSection: ['researchAreaDescriptions'],
  researchTasksSection: ['researchTasks'],
  contractsSection: ['contracts'],
  membersSection: ['ugTeams', 'guestTeams'],
  publicationsSection: ['publications'],
  spubTasksSection: ['spubTasks'],
} as const;

/**
 * TanStack keys array rows as `permissions[0].description`, so a section-level field
 * matches either exactly or as the prefix of a row path.
 */
function hasError(errors: Record<string, string[]>, field: string) {
  return Object.keys(errors).some((key) => key === field || key.startsWith(`${field}[`) || key.startsWith(`${field}.`));
}

/**
 * Checks each section separately against a single validation result, reporting one step per
 * section. Soft assertions keep every section evaluated, so one failing section still shows
 * that all the others behaved as expected.
 */
async function expectSectionsInvalid(
  errors: Record<string, string[]>,
  sectionFields: Record<string, readonly string[]>
) {
  const reportedKeys = Object.keys(errors).join(', ') || '(none)';

  for (const [section, fields] of Object.entries(sectionFields)) {
    await test.step(section, () => {
      for (const field of fields) {
        expect
          .soft(hasError(errors, field), `${section}: expected an error on "${field}"; reported: [${reportedKeys}]`)
          .toBe(true);
      }
    });
  }
}

test('all sections valid', async ({ formAPage }) => {
  await formAPage.fillForm();
  await formAPage.submitForm({ expectedResult: 'valid' });
});

test('all required sections missing', async ({ formAPage }) => {
  await formAPage.fillForm({ except: Object.keys(REQUIRED_SECTION_FIELDS) as FormASection[] });

  await formAPage.submitButton.click();

  // The form does not navigate when invalid, so its TanStack state can be read directly.
  // One submit yields an independent verdict per section.
  const errors = await formAPage.getInvalidFormState();
  await expectSectionsInvalid(errors, REQUIRED_SECTION_FIELDS);
});

test('all sections filled with invalid rows', async ({ formAPage }) => {
  // Every list-based section gets one row with empty required fields and negative counts
  await formAPage.fillForm({ withInvalidRows: true });

  await formAPage.submitButton.click();

  const errors = await formAPage.getInvalidFormState();
  await expectSectionsInvalid(errors, INVALID_ROW_SECTION_FIELDS);
});

test('centers the first invalid field after submit', async ({ formAPage }) => {
  // The fixture loads a valid application, so blank a section to give submit something to fail
  // on. It has to be a mid-form section: an element at the very top or bottom of the document
  // cannot be scrolled to the middle of the viewport, which is what this test asserts.
  await formAPage.fillForm({ except: ['cruiseGoalSection'] });
  await formAPage.page.evaluate(() => {
    const scrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')!.value;
    HTMLElement.prototype.scrollIntoView = function (options) {
      document.documentElement.dataset.lastScrollBlock = typeof options === 'object' ? options.block : '';
      scrollIntoView.call(this, options);
    };
  });
  await formAPage.submitButton.click();

  const firstInvalidField = formAPage.page.locator('[aria-invalid="true"], [data-error="true"]').first();
  await expect(firstInvalidField).toBeFocused();
  await expect(formAPage.page.locator('html')).toHaveAttribute('data-last-scroll-block', 'center');
  await expect
    .poll(async () => {
      const box = await firstInvalidField.boundingBox();
      const viewportHeight = formAPage.page.viewportSize()!.height;
      const fieldCenter = box ? box.y + box.height / 2 : 0;
      return fieldCenter > viewportHeight * 0.25 && fieldCenter < viewportHeight * 0.75;
    })
    .toBe(true);
});

test('shows server validation errors on their fields', async ({ formAPage }) => {
  await formAPage.fillForm();
  await formAPage.failSaveWith(400, {
    errors: { 'Form.SupervisorEmail': ['Adres przełożonego został odrzucony'] },
  });

  await formAPage.submitButton.click();

  await expect(formAPage.sections.supervisorInfoSection.invalidEmailMessage).toContainText(
    'Adres przełożonego został odrzucony'
  );
  await expect(formAPage.sections.supervisorInfoSection.supervisorEmailInput).toBeFocused();
});

test('shows a support code when saving fails', async ({ formAPage }) => {
  await formAPage.fillForm();
  await formAPage.failSaveWith(503, { detail: 'Wystąpił nieoczekiwany błąd. Kod błędu: 0HNC7ABC123' });

  await formAPage.submitButton.click();

  await expect(formAPage.validationErrorMessage).toContainText('Kod błędu: 0HNC7ABC123');
});

test.describe('cruise length section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['cruiseLengthSection'] });
  });

  // The number inputs cap out-of-range values in the browser, which the schema cannot do
  const cappingCases: [string, number, number][] = [
    ['days', 61, 60],
    ['days', 100, 60],
    ['hours', 1441, 1440],
    ['hours', 1500, 1440],
  ];

  cappingCases.forEach(([field, input, expectedValue]) => {
    test(`${field} input caps ${input} to ${expectedValue}`, async ({ formAPage }) => {
      const section = formAPage.sections.cruiseLengthSection;
      const target = field === 'days' ? section.cruiseDaysInput : section.cruiseHoursInput;

      await section.defaultFill();
      await target.fill(input.toString());
      await expect(target).toHaveValue(`${expectedValue}`);
    });
  });

  test('alternative ship usage field appears and is required', async ({ formAPage }) => {
    const section = formAPage.sections.cruiseLengthSection;
    await section.defaultFill();
    await section.shipUsageDropdown.selectOption('w inny sposób');

    await touchInput(section.alternativeShipUsageInput);
    await expect(section.emptyAlternativeShipUsageMessage).toBeVisible();

    await section.alternativeShipUsageInput.fill('jakieś inne użycie');
    // plain Locator, so it does not get FormInput.fill's automatic blur
    await section.alternativeShipUsageInput.blur();
    await expect(section.emptyAlternativeShipUsageMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise goal section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['cruiseGoalSection'] });
  });

  test('goal description field appears and is required', async ({ formAPage }) => {
    const section = formAPage.sections.cruiseGoalSection;
    await section.cruiseGoalDropdown.selectOption('Komercyjny');

    await touchInput(section.cruiseGoalDescriptionInput);
    await expect(section.noCruiseGoalDescriptionMessage).toBeVisible();

    await section.cruiseGoalDescriptionInput.fill('Jakiś opis');
    // plain Locator, so it does not get FormInput.fill's automatic blur
    await section.cruiseGoalDescriptionInput.blur();
    await expect(section.noCruiseGoalDescriptionMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('contracts section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['contractsSection'] });
  });

  // Row-level contract validation is unit tested; this covers the scan upload, which is UI only.
  test.fixme('scan file is required', async ({ formAPage }) => {
    const contractsSection = formAPage.sections.contractsSection;
    await contractsSection.addNewContractDropdown.selectOption('Międzynarodowa');
    const contractRow = contractsSection.contractRow('first');

    for (const inputField of [
      contractRow.institutionNameInput,
      contractRow.institutionUnitInput,
      contractRow.institutionLocationInput,
      contractRow.descriptionInput,
    ]) {
      await inputField.fill('Wartość');
    }

    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(contractRow.scanFileInput.errors.required).toBeVisible();

    await contractRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await expect(contractRow.scanFileInput.errors.required).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('adding rows through the UI', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({
      except: ['researchAreaSection', 'researchTasksSection', 'membersSection'],
    });
  });

  test('rows added via dropdowns and buttons make the form submittable', async ({ formAPage }) => {
    const { researchAreaSection, researchTasksSection, membersSection } = formAPage.sections;

    await researchAreaSection.addResearchAreaDropdown.selectOption('Głębia Gdańska');
    await expect(researchAreaSection.noResearchAreasMessage).toBeHidden();

    await researchTasksSection.addNewTaskDropdown.selectOption('Praca doktorska');
    await expect(researchTasksSection.noResearchTasksMessage).toBeHidden();
    await researchTasksSection.authorInput('first').fill('Jakiś autor');
    await researchTasksSection.titleInput('first').fill('Jakiś tytuł');

    await membersSection.addUGUnitDropdown.selectOption('Biuro Prawne (0300)');
    await expect(membersSection.noUGUnitsMessage).toBeHidden();
    await membersSection.ugUnitRow('first').noOfEmployeesInput.fill('1');

    await membersSection.addNewGuestTeamButton.click();
    await membersSection.guestTeamRow('first').teamNameInput.fill('Jakiś zespół');
    await membersSection.guestTeamRow('first').noOfPeopleInput.fill('1');

    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test('number inputs keep precision, transient decimals, clearing, sync and stepping', async ({ formAPage, page }) => {
  const task = {
    type: '4',
    title: 'Projekt',
    startDate: '2026-09',
    endDate: '2026-10',
    financingAmount: '100',
    securedAmount: '5',
  };
  await page.route(`${API_URL}/v2/applications/${formAPage.formId}/form-a`, (route) =>
    route.fulfill({ json: { ...getFormAPayload(), cruiseHours: '48', researchTasks: [task] } })
  );
  await formAPage.goto();
  const section = formAPage.sections.cruiseLengthSection;
  const days = section.cruiseDaysInput;
  const hours = section.cruiseHoursInput;
  const amount = page.locator('input[name="researchTasks[0].financingAmount"]');
  await expect(days).toHaveValue('2');
  await expect(hours).toHaveValue('48');

  await days.fill('1,');
  await expect(days).toHaveValue('1.');
  await days.press('5');
  await expect(days).toHaveValue('1.5');
  await expect(hours).toHaveValue('36');
  await days.blur();
  await expect(days).toHaveValue('1.5');

  await days.fill('1.257');
  await expect(hours).toHaveValue('30');
  await expect(days).toHaveValue('1.25');

  await hours.fill('7.9');
  await expect(hours).toHaveValue('7');
  await expect(days).toHaveValue('0.29');

  await section.cruiseDaysIncreaseButton.click();
  await expect(hours).toHaveValue('31');
  await expect(days).toHaveValue('1.29');
  await section.cruiseHoursDecreaseButton.click();
  await expect(hours).toHaveValue('30');

  await hours.fill('');
  await expect(hours).toHaveValue('0');
  await expect(days).toHaveValue('0');

  await amount.fill('');
  await amount.blur();
  await expect(amount).toHaveValue('');
  await amount.fill('12,345');
  await amount.blur();
  await expect(amount).toHaveValue('12.35');
});

for (const picker of [
  {
    task: { type: '3', title: 'Project', date: '2026-09-01', financingApproved: 'false' },
    field: 'date',
    message: 'Data nie może być pusta',
  },
  {
    task: {
      type: '4',
      title: 'Project',
      startDate: '2026-09-01',
      endDate: '2026-10-01',
      financingAmount: '100',
      securedAmount: '100',
    },
    field: 'startDate',
    message: 'Data rozpoczęcia nie może być pusta',
  },
]) {
  test(`cleared research ${picker.field} validates before submission and allows correction`, async ({
    formAPage,
    page,
  }) => {
    await page.route(`${API_URL}/v2/applications/${formAPage.formId}/form-a`, (route) =>
      route.fulfill({ json: { ...getFormAPayload(), researchTasks: [picker.task] } })
    );
    await formAPage.goto();
    const control = page.locator(`button[name="researchTasks[0].${picker.field}"]`);
    await control.getByRole('button').click();
    await page.locator('input[name="researchTasks[0].title"]').click();
    await expect(page.getByText(picker.message, { exact: true })).toBeVisible();
    await control.click();
    await page
      .getByRole('menu')
      .getByRole('button', { name: picker.field === 'date' ? '15' : 'Wrzesień', exact: true })
      .click();
    await expect(page.getByText(picker.message, { exact: true })).toHaveCount(0);
  });
}
