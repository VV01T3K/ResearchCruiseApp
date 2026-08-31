import { expect } from '@playwright/test';
import { formTest as test } from '@tests/fixtures/fixtures';

import { API_URL, MOCK_IMAGE_FILEPATH, MOCK_PDF_FILEPATH } from './fixtures/consts';
import { touchInput } from './utils/form-filling-utils';

test('missing form B shows not found', async ({ formCPage }) => {
  await formCPage.page.route(`${API_URL}/v2/applications/${formCPage.formId}/form-b`, (route) =>
    route.fulfill({ status: 404 })
  );

  await formCPage.goto();

  await expect(formCPage.page.getByText('Strona nie znaleziona')).toBeVisible();
});

/** Section → fields that must report an error when the section holds a row of invalid data. */
const INVALID_ROW_SECTION_FIELDS = {
  additionalPermissionsSection: ['permissions'],
  researchAreaSection: ['researchAreaDescriptions'],
  researchTasksSection: ['researchTasksEffects'],
  contractsSection: ['contracts'],
  membersSection: ['ugTeams', 'guestTeams'],
  spubTasksSection: ['spubTasks'],
  cruiseDetailsSection: ['shortResearchEquipments', 'longResearchEquipments', 'ports'],
  cruiseDayDetailsSection: ['cruiseDaysDetails'],
  researchEquipmentsSection: ['researchEquipments'],
  collectedSamplesSection: ['collectedSamples'],
} as const;

/**
 * TanStack keys array rows as `ports[0].name`, so a section-level field matches either
 * exactly or as the prefix of a row path.
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

test('all sections valid', async ({ formCPage }) => {
  await formCPage.fillForm();
  await formCPage.submitForm({ expectedResult: 'valid' });
});

test('all sections filled with invalid rows', async ({ formCPage }) => {
  // Every list-based section gets one row with empty required fields and negative counts
  await formCPage.fillForm({ withInvalidRows: true });

  await formCPage.submitButton.click();

  // The form does not navigate when invalid, so its TanStack state can be read directly.
  // One submit yields an independent verdict per section.
  const errors = await formCPage.getInvalidFormState();
  await expectSectionsInvalid(errors, INVALID_ROW_SECTION_FIELDS);
});

test.describe('additional permissions section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['additionalPermissionsSection'] });
  });

  // The scan upload is the one part of a permission row that cannot be unit tested
  test('permission added through the UI requires a scan', async ({ formCPage }) => {
    const section = formCPage.sections.additionalPermissionsSection;
    await section.addPermissionButton.click();
    const permissionRow = section.permissionRow('last');

    await permissionRow.descriptionInput.fill('Jakiś opis');
    await permissionRow.executiveInput.fill('Jakiś organ');

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(permissionRow.scanFileInput.errors.required).toBeVisible();

    await permissionRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await expect(permissionRow.scanFileInput.errors.required).toBeHidden();
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('research tasks section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['researchTasksSection'] });
  });

  // Checkbox enablement is driven by React state and cannot be checked from the schema
  test('condition checkboxes are available only after a task is marked as done', async ({ formCPage }) => {
    const taskRow = formCPage.sections.researchTasksSection.taskRow('first');

    await expect(taskRow.managerConditionMetCheckbox).toBeDisabled();
    await expect(taskRow.deputyConditionMetCheckbox).toBeDisabled();

    await taskRow.doneCheckbox.check();

    await expect(taskRow.managerConditionMetCheckbox).toBeEnabled();
    await expect(taskRow.deputyConditionMetCheckbox).toBeEnabled();

    await taskRow.managerConditionMetCheckbox.check();
    await taskRow.doneCheckbox.uncheck();

    await expect(taskRow.managerConditionMetCheckbox).toBeDisabled();
    await expect(taskRow.deputyConditionMetCheckbox).toBeDisabled();
    await expect(taskRow.managerConditionMetCheckbox).not.toBeChecked();
    await expect(taskRow.deputyConditionMetCheckbox).not.toBeChecked();
  });
});

test.describe('contracts section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['contractsSection'] });
  });

  // Row-level contract validation is unit tested; this covers the scan upload, which is UI only.
  test.fixme('scan file is required', async ({ formCPage }) => {
    const contractsSection = formCPage.sections.contractsSection;
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

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(contractRow.scanFileInput.errors.required).toBeVisible();

    await contractRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await expect(contractRow.scanFileInput.errors.required).toBeHidden();
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('members section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['membersSection'] });
  });

  test('duplicate faculty is reported and clears when a row is removed', async ({ formCPage }) => {
    const membersSection = formCPage.sections.membersSection;
    await membersSection.addUGUnitDropdown.selectOption('Szkoły Doktorskie (0C00)');
    await membersSection.ugUnitRow('last').noOfEmployeesInput.fill('1');
    await membersSection.addUGUnitDropdown.selectOption('Szkoły Doktorskie (0C00)');
    await membersSection.ugUnitRow('last').noOfEmployeesInput.fill('2');
    await expect(membersSection.duplicateFacultyMessage).toBeVisible();

    await formCPage.submitForm({ expectedResult: 'invalid' });

    await membersSection.ugUnitRow('last').deleteButton.click();
    await expect(membersSection.duplicateFacultyMessage).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('guest team row added through the UI makes the form submittable', async ({ formCPage }) => {
    const membersSection = formCPage.sections.membersSection;
    await membersSection.addNewGuestTeamButton.click();
    const guestTeamRow = membersSection.guestTeamRow('first');

    await touchInput(guestTeamRow.teamNameInput);
    await expect(guestTeamRow.teamNameInput.errors.required).toBeVisible();

    await guestTeamRow.teamNameInput.fill('Jakiś zespół');
    await expect(guestTeamRow.teamNameInput.errors.required).toBeHidden();

    await guestTeamRow.noOfPeopleInput.fill('1');
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('SPUB tasks section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['spubTasksSection'] });
  });

  test('task row added through the UI makes the form submittable', async ({ formCPage }) => {
    const spubTasksSection = formCPage.sections.spubTasksSection;
    await spubTasksSection.addNewTaskButton.click();
    const taskRow = spubTasksSection.taskRow('first');

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(taskRow.nameDropdown.errors.required).toBeVisible();

    await taskRow.nameDropdown.dropdown.click();
    await formCPage.page.getByRole('option').first().click();
    await taskRow.startYearDropdown.selectOption('2023');
    await taskRow.endYearDropdown.selectOption('2025');

    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise details section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['cruiseDetailsSection'] });
  });

  test('equipment, action and port rows added through the UI make the form submittable', async ({ formCPage }) => {
    const section = formCPage.sections.cruiseDetailsSection;
    const currentDay = String(await formCPage.page.evaluate(() => new Date().getDate()));

    await section.addEquipmentButton.click();
    const equipmentRow = section.equipmentRow('first');
    await equipmentRow.nameInput.fill('Jakiś sprzęt');
    await equipmentRow.fromDateDropdown.selectOption(currentDay);
    await equipmentRow.toDateDropdown.selectOption(currentDay);

    await section.addEquipmentActionDropdown.selectOption('Pozostawienie');
    const actionRow = section.equipmentActionRow('first');
    await actionRow.timeInput.fill('10');
    await actionRow.nameInput.fill('Jakaś nazwa');

    await section.addPortButton.click();
    const portRow = section.portRow('first');
    await portRow.nameInput.fill('Jakaś nazwa');
    await portRow.fromDateDropdown.selectOption(currentDay);
    await portRow.toDateDropdown.selectOption(currentDay);

    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise day details section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['cruiseDayDetailsSection'] });
  });

  test('task row added through the UI makes the form submittable', async ({ formCPage }) => {
    const section = formCPage.sections.cruiseDayDetailsSection;
    await section.addTaskButton.click();
    const taskRow = section.taskRow('first');

    await touchInput(taskRow.nameInput);
    await expect(taskRow.nameInput.errors.required).toBeVisible();

    for (const inputField of [taskRow.nameInput, taskRow.regionInput, taskRow.positionInput]) {
      await inputField.fill('Wartość');
      await expect(inputField.errors.required).toBeHidden();
    }

    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('research equipments section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['researchEquipmentsSection'] });
  });

  test('equipment row added through the UI makes the form submittable', async ({ formCPage }) => {
    const section = formCPage.sections.researchEquipmentsSection;
    await section.addEquipmentButton.click();
    const equipmentRow = section.equipmentRow('first');

    await touchInput(equipmentRow.nameInput);
    await expect(equipmentRow.nameInput.errors.required).toBeVisible();

    await equipmentRow.nameInput.fill('Jakiś sprzęt');
    await expect(equipmentRow.nameInput.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('collected samples section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['collectedSamplesSection'] });
  });

  test('sample row added through the UI makes the form submittable', async ({ formCPage }) => {
    const section = formCPage.sections.collectedSamplesSection;
    await section.addSampleButton.click();
    const sampleRow = section.sampleRow('first');

    await touchInput(sampleRow.typeInput);
    await expect(sampleRow.typeInput.errors.required).toBeVisible();

    for (const inputField of [sampleRow.typeInput, sampleRow.analysisInput, sampleRow.publishingInput]) {
      await inputField.fill('Wartość');
      await expect(inputField.errors.required).toBeHidden();
    }

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(sampleRow.quantityInput.errors.invalidValue).toBeVisible();

    await sampleRow.quantityInput.fill('10');
    await expect(sampleRow.quantityInput.errors.invalidValue).toBeHidden();
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('free text sections', () => {
  const LENGTH_LIMIT = 10240;

  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['spubReportDataSection', 'additionalDescriptionSection'] });
  });

  // The max-length error surfaces while typing, before any submit
  test('report and description reject text over the length limit', async ({ formCPage }) => {
    const reportInput = formCPage.sections.spubReportDataSection.reportInput;
    const descriptionInput = formCPage.sections.additionalDescriptionSection.descriptionInput;

    await reportInput.fill('A'.repeat(LENGTH_LIMIT + 1));
    await expect(reportInput.errors.tooLong).toBeVisible();
    await descriptionInput.fill('A'.repeat(LENGTH_LIMIT + 1));
    await expect(descriptionInput.errors.tooLong).toBeVisible();

    await formCPage.submitForm({ expectedResult: 'invalid' });

    await reportInput.fill('A'.repeat(LENGTH_LIMIT));
    await expect(reportInput.errors.tooLong).toBeHidden();
    await descriptionInput.fill('A'.repeat(LENGTH_LIMIT));
    await expect(descriptionInput.errors.tooLong).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('attachments can be uploaded', async ({ formCPage }) => {
    const section = formCPage.sections.additionalDescriptionSection;
    await section.descriptionInput.fill('Jakiś opis');
    await section.sendAttachment([MOCK_PDF_FILEPATH, MOCK_IMAGE_FILEPATH, MOCK_IMAGE_FILEPATH]);
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});
