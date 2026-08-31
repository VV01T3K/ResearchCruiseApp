import { expect } from '@playwright/test';
import { formTest as test } from '@tests/fixtures/fixtures';

import { MOCK_PDF_FILEPATH } from './fixtures/consts';
import { touchInput } from './utils/form-filling-utils';

/** Section → fields that must report an error when the section holds a row of invalid data. */
const INVALID_ROW_SECTION_FIELDS = {
  additionalPermissionsSection: ['permissions'],
  membersSection: ['ugTeams', 'guestTeams', 'crewMembers'],
  cruiseDetailsSection: ['shortResearchEquipments', 'longResearchEquipments', 'ports'],
  cruiseDayDetailsSection: ['cruiseDaysDetails'],
  researchEquipmentsSection: ['researchEquipments'],
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

test('all sections valid', async ({ formBPage }) => {
  await formBPage.fillForm();
  await formBPage.submitForm({ expectedResult: 'valid' });
});

test('all sections filled with invalid rows', async ({ formBPage }) => {
  // Every list-based section gets one row with empty required fields and negative counts
  await formBPage.fillForm({ withInvalidRows: true });

  await formBPage.submitButton.click();

  // The form does not navigate when invalid, so its TanStack state can be read directly.
  // One submit yields an independent verdict per section.
  const errors = await formBPage.getInvalidFormState();
  await expectSectionsInvalid(errors, INVALID_ROW_SECTION_FIELDS);
});

test.describe('additional permissions section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['additionalPermissionsSection'] });
  });

  // The scan upload is the one part of a permission row that cannot be unit tested
  test('permission added through the UI requires a scan', async ({ formBPage }) => {
    const section = formBPage.sections.additionalPermissionsSection;
    await section.addPermissionButton.click();
    const permissionRow = section.permissionRow('last');

    await permissionRow.descriptionInput.fill('Jakiś opis');
    await permissionRow.executiveInput.fill('Jakiś organ');

    await formBPage.submitForm({ expectedResult: 'invalid' });
    await expect(permissionRow.scanFileInput.errors.required).toBeVisible();

    await permissionRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await expect(permissionRow.scanFileInput.errors.required).toBeHidden();
    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('members section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['membersSection'] });
  });

  test('duplicate faculty is reported and clears when a row is removed', async ({ formBPage }) => {
    const membersSection = formBPage.sections.membersSection;
    await membersSection.addUGUnitDropdown.selectOption('Szkoły Doktorskie (0C00)');
    await membersSection.ugUnitRow('last').noOfEmployeesInput.fill('1');
    await membersSection.addUGUnitDropdown.selectOption('Szkoły Doktorskie (0C00)');
    await membersSection.ugUnitRow('last').noOfEmployeesInput.fill('2');
    await expect(membersSection.duplicateFacultyMessage).toBeVisible();

    await formBPage.submitForm({ expectedResult: 'invalid' });

    await membersSection.ugUnitRow('last').deleteButton.click();
    await expect(membersSection.duplicateFacultyMessage).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });

  test('rows added through the UI make the form submittable', async ({ formBPage }) => {
    const membersSection = formBPage.sections.membersSection;

    await membersSection.addNewGuestTeamButton.click();
    const guestTeamRow = membersSection.guestTeamRow('first');
    await touchInput(guestTeamRow.teamNameInput);
    await expect(guestTeamRow.teamNameInput.errors.required).toBeVisible();
    await guestTeamRow.teamNameInput.fill('Jakiś zespół');
    await guestTeamRow.noOfPeopleInput.fill('1');

    await membersSection.addPermissionButton.click();
    const permissionRow = membersSection.permissionRow('first');
    for (const inputField of [
      permissionRow.titleInput,
      permissionRow.namesInput,
      permissionRow.surnameInput,
      permissionRow.birthplaceInput,
      permissionRow.documentIdInput,
      permissionRow.unitNameInput,
    ]) {
      await inputField.fill('Wartość');
    }
    await permissionRow.birthdayDropdown.selectOption('11');
    await permissionRow.documentExpirationDateDropdown.selectOption('11');

    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise details section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['cruiseDetailsSection'] });
  });

  test('equipment, action and port rows added through the UI make the form submittable', async ({ formBPage }) => {
    const section = formBPage.sections.cruiseDetailsSection;
    const currentDay = String(await formBPage.page.evaluate(() => new Date().getDate()));

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

    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise day details section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['cruiseDayDetailsSection'] });
  });

  test('task row added through the UI makes the form submittable', async ({ formBPage }) => {
    const section = formBPage.sections.cruiseDayDetailsSection;
    await section.addTaskButton.click();
    const taskRow = section.taskRow('first');

    await touchInput(taskRow.nameInput);
    await expect(taskRow.nameInput.errors.required).toBeVisible();

    for (const inputField of [taskRow.nameInput, taskRow.regionInput, taskRow.positionInput]) {
      await inputField.fill('Wartość');
      await expect(inputField.errors.required).toBeHidden();
    }

    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('research equipments section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['researchEquipmentsSection'] });
  });

  test('equipment row added through the UI makes the form submittable', async ({ formBPage }) => {
    const section = formBPage.sections.researchEquipmentsSection;
    await section.addEquipmentButton.click();
    const equipmentRow = section.equipmentRow('first');

    await touchInput(equipmentRow.nameInput);
    await expect(equipmentRow.nameInput.errors.required).toBeVisible();

    await equipmentRow.nameInput.fill('Jakiś sprzęt');
    await expect(equipmentRow.nameInput.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});
