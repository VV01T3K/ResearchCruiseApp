import { expect } from '@playwright/test';

import {
  formADefaultValues,
  getFormADraftWriteSchema,
  getFormAWriteSchema,
  mapFormAToValues,
  mapResearchTaskToValues,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';

import { API_URL, MOCK_PDF_FILEPATH } from './fixtures/consts';
import { formTest as test } from './fixtures/fixtures';
import { type FormAPage } from './fixtures/pages/formA/formAPage';
import { getFormAPayload, getInitValuesAPayload } from './fixtures/mockPayloads';
import { touchInput } from './utils/form-filling-utils';

type FormASection = keyof FormAPage['sections'];

test('draft form A requires the complete input shape while allowing empty values', () => {
  const initValues = getInitValuesAPayload();
  const draft = {
    ...formADefaultValues,
    cruiseManagerId: initValues.cruiseManagers[0].id,
    year: initValues.years[0],
    permissions: [{ description: '', executive: '', scan: undefined }],
  };
  const schema = getFormADraftWriteSchema();
  expect(schema.safeParse(draft).success).toBe(true);

  const { note: _omitted, ...missingKey } = draft;
  expect(schema.safeParse(missingKey).success).toBe(false);
});

test('preserves empty research task numbers through the form round trip', () => {
  const initValues = getInitValuesAPayload();
  const draft = {
    ...formADefaultValues,
    cruiseManagerId: initValues.cruiseManagers[0].id,
    researchTasks: [
      {
        type: '4' as const,
        title: '',
        financingAmount: null,
        startDate: '',
        endDate: '',
        securedAmount: null,
      },
      {
        type: '10' as const,
        title: '',
        date: '',
        magazine: '',
        ministerialPoints: null,
      },
    ],
  };

  expect(mapResearchTaskToValues({ type: '4', financingAmount: null, securedAmount: null })).toMatchObject({
    financingAmount: null,
    securedAmount: null,
  });
  expect(mapResearchTaskToValues({ type: '10', ministerialPoints: null })).toMatchObject({
    ministerialPoints: null,
  });

  const request = getFormADraftWriteSchema().parse(draft);
  expect(request.form.researchTasks![0]).toMatchObject({ financingAmount: null, securedAmount: null });
  expect(request.form.researchTasks![1]).toMatchObject({ ministerialPoints: null });
});

test('normalizes backend precise-period datetimes at the API boundary', () => {
  const initValues = getInitValuesAPayload();
  const form = {
    ...mapFormAToValues(getFormAPayload()),
    cruiseManagerId: initValues.cruiseManagers[0].id,
    deputyManagerId: initValues.deputyManagers[1].id,
    year: initValues.years[0],
    periodSelectionType: 'precise' as const,
    acceptablePeriod: '',
    optimalPeriod: '',
    precisePeriodStart: '2026-07-20',
    precisePeriodEnd: '2026-07-23T00:00:00',
    cruiseDays: 2,
    cruiseHours: 3,
    note: '',
  };

  const request = getFormAWriteSchema(initValues).parse(form);

  expect(request.form.precisePeriodStart).toBe('2026-07-20T00:00:00Z');
  expect(request.form.precisePeriodEnd).toBe('2026-07-23T00:00:00Z');
  expect(request.form.cruiseHours).toBe(String(form.cruiseDays * 24 + form.cruiseHours));
  expect(request.form).not.toHaveProperty('cruiseDays');
});

/** Section → the form fields that must report an error when that section is invalid. */
const REQUIRED_SECTION_FIELDS = {
  cruiseManagerInfoSection: ['deputyManagerId'],
  cruiseLengthSection: ['cruiseHours', 'shipUsage'],
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
  await formAPage.page.route(`${API_URL}/v2/applications`, (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/problem+json',
      body: JSON.stringify({ errors: { 'Form.SupervisorEmail': ['Adres przełożonego został odrzucony'] } }),
    })
  );

  await formAPage.submitButton.click();

  await expect(formAPage.sections.supervisorInfoSection.invalidEmailMessage).toContainText(
    'Adres przełożonego został odrzucony'
  );
  await expect(formAPage.sections.supervisorInfoSection.supervisorEmailInput).toBeFocused();
});

test('shows a support code when saving fails', async ({ formAPage }) => {
  await formAPage.fillForm();
  await formAPage.page.route(`${API_URL}/v2/applications`, (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/problem+json',
      body: JSON.stringify({ detail: 'Wystąpił nieoczekiwany błąd. Kod błędu: 0HNC7ABC123' }),
    })
  );

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
