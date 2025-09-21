import { expect } from '@playwright/test';
import { formTest as test } from '@tests/fixtures/fixtures';

import { MOCK_PDF_FILEPATH } from './fixtures/consts';
import { touchInput } from './utils/form-filling-utils';

test('valid form B', async ({ formBPage }) => {
  await formBPage.fillForm(); // Fill the form with default values
  await formBPage.submitForm({ expectedResult: 'valid' });
});

test.describe('additional permissions section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['additionalPermissionsSection'] });
  });

  test('no permissions added', async ({ formBPage }) => {
    await formBPage.submitForm({ expectedResult: 'valid' });
  });

  test('add permission', async ({ formBPage }) => {
    const additionalPermissionsSection = formBPage.sections.additionalPermissionsSection;
    await additionalPermissionsSection.addPermissionButton.click();
    const permissionRow = additionalPermissionsSection.permissionRow('last');
    await permissionRow.descriptionInput.fill('Jakiś opis');
    await permissionRow.executiveInput.fill('Jakiś organ');
    await permissionRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await formBPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing description and executive', async ({ formBPage }) => {
    const additionalPermissionsSection = formBPage.sections.additionalPermissionsSection;
    await additionalPermissionsSection.addPermissionButton.click();
    const permissionRow = additionalPermissionsSection.permissionRow('last');
    await permissionRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await formBPage.submitForm({ expectedResult: 'invalid' });

    await expect(permissionRow.descriptionInput.errors.required).toBeVisible();
    await expect(permissionRow.executiveInput.errors.required).toBeVisible();

    await permissionRow.descriptionInput.fill('Jakiś opis');
    await expect(permissionRow.descriptionInput.errors.required).toBeHidden();
    await permissionRow.executiveInput.fill('Jakiś organ');
    await expect(permissionRow.executiveInput.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing scan file', async ({ formBPage }) => {
    const additionalPermissionsSection = formBPage.sections.additionalPermissionsSection;
    await additionalPermissionsSection.addPermissionButton.click();
    const permissionRow = additionalPermissionsSection.permissionRow('last');
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

  test('duplicate faculty', async ({ formBPage }) => {
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

  test('guest team input', async ({ formBPage }) => {
    const membersSection = formBPage.sections.membersSection;
    await membersSection.addNewGuestTeamButton.click();
    const guestTeamRow = membersSection.guestTeamRow('first');

    // for the 'empty' message to appear, the field must be detected as touched, so it is filled with some value at first
    await touchInput(guestTeamRow.teamNameInput);
    await expect(guestTeamRow.teamNameInput.errors.required).toBeVisible();

    await guestTeamRow.teamNameInput.fill('Jakiś zespół');
    await expect(guestTeamRow.teamNameInput.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'invalid' });
    await expect(guestTeamRow.noOfPeopleInput.errors.invalidValue).toBeVisible();

    await guestTeamRow.noOfPeopleInput.fill('1');
    await expect(guestTeamRow.noOfPeopleInput.errors.invalidValue).toBeHidden();
    await formBPage.submitForm({ expectedResult: 'valid' });
  });

  test('permission inputs', async ({ formBPage }) => {
    const membersSection = formBPage.sections.membersSection;
    await membersSection.addPermissionButton.click();

    const permissionRow = membersSection.permissionRow('first');
    const inputFields = [
      permissionRow.titleInput,
      permissionRow.namesInput,
      permissionRow.surnameInput,
      permissionRow.birthplaceInput,
      permissionRow.documentIdInput,
      permissionRow.unitNameInput,
    ];
    for (const inputField of inputFields) {
      await touchInput(inputField);
      await expect(inputField.errors.required).toBeVisible();
    }

    await formBPage.submitForm();
    await expect(formBPage.submissionApprovedMessage).toBeHidden();

    for (const inputField of inputFields) {
      await inputField.fill('Wartość');
      await expect(inputField.errors.required).toBeHidden();
    }

    await formBPage.submitForm({ expectedResult: 'invalid' });

    await expect(permissionRow.birthdayDropdown.errors.required).toBeVisible();
    await expect(permissionRow.documentExpirationDateDropdown.errors.required).toBeVisible();

    await permissionRow.birthdayDropdown.selectOption('11');
    await expect(permissionRow.birthdayDropdown.errors.required).toBeHidden();
    await permissionRow.documentExpirationDateDropdown.selectOption('11');
    await expect(permissionRow.documentExpirationDateDropdown.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise details section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['cruiseDetailsSection'] });
  });

  test('equipment input', async ({ formBPage }) => {
    const cruiseDetailsSection = formBPage.sections.cruiseDetailsSection;
    await cruiseDetailsSection.addEquipmentButton.click();
    const equipmentRow = cruiseDetailsSection.equipmentRow('first');

    await formBPage.submitForm();
    await expect(formBPage.submissionApprovedMessage).toBeHidden();

    touchInput(equipmentRow.nameInput);
    await expect(equipmentRow.nameInput.errors.required).toBeVisible();

    await equipmentRow.nameInput.fill('Jakiś sprzęt');
    await expect(equipmentRow.nameInput.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'invalid' });
    await expect(equipmentRow.fromDateDropdown.errors.required).toBeVisible();
    await expect(equipmentRow.toDateDropdown.errors.required).toBeVisible();

    await equipmentRow.fromDateDropdown.selectOption('11');
    await expect(equipmentRow.fromDateDropdown.errors.required).toBeHidden();
    await equipmentRow.toDateDropdown.selectOption('13');
    await expect(equipmentRow.toDateDropdown.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });

  test('equipment action input', async ({ formBPage }) => {
    const cruiseDetailsSection = formBPage.sections.cruiseDetailsSection;
    await cruiseDetailsSection.addEquipmentActionDropdown.selectOption('Pozostawienie');
    const actionRow = cruiseDetailsSection.equipmentActionRow('first');

    await formBPage.submitForm();
    await expect(formBPage.submissionApprovedMessage).toBeHidden();

    touchInput(actionRow.timeInput);
    await expect(actionRow.timeInput.errors.required).toBeVisible();
    touchInput(actionRow.nameInput);
    await expect(actionRow.nameInput.errors.required).toBeVisible();

    await actionRow.timeInput.fill('10');
    await expect(actionRow.timeInput.errors.required).toBeHidden();
    await actionRow.nameInput.fill('Jakaś nazwa');
    await expect(actionRow.nameInput.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });

  test('port input', async ({ formBPage }) => {
    const cruiseDetailsSection = formBPage.sections.cruiseDetailsSection;
    await cruiseDetailsSection.addPortButton.click();
    const portRow = cruiseDetailsSection.portRow('first');

    await formBPage.submitForm();
    await expect(formBPage.submissionApprovedMessage).toBeHidden();

    touchInput(portRow.nameInput);
    await expect(portRow.nameInput.errors.required).toBeVisible();

    await portRow.nameInput.fill('Jakaś nazwa');
    await expect(portRow.nameInput.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'invalid' });
    await expect(portRow.fromDateDropdown.errors.required).toBeVisible();
    await expect(portRow.toDateDropdown.errors.required).toBeVisible();

    await portRow.fromDateDropdown.selectOption('11');
    await expect(portRow.fromDateDropdown.errors.required).toBeHidden();
    await portRow.toDateDropdown.selectOption('13');
    await expect(portRow.toDateDropdown.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise day details section tests', () => {
  test.beforeEach(async ({ formBPage }) => {
    await formBPage.fillForm({ except: ['cruiseDayDetailsSection'] });
  });

  test('task input', async ({ formBPage }) => {
    const cruiseDayDetailsSection = formBPage.sections.cruiseDayDetailsSection;
    await cruiseDayDetailsSection.addTaskButton.click();
    const taskRow = cruiseDayDetailsSection.taskRow('first');
    await formBPage.submitForm();
    await expect(formBPage.submissionApprovedMessage).toBeHidden();

    const inputFields = [taskRow.nameInput, taskRow.regionInput, taskRow.positionInput, taskRow.commentInput];

    for (const inputField of inputFields) {
      await touchInput(inputField);
      await expect(inputField.errors.required).toBeVisible();
    }

    for (const inputField of inputFields) {
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

  test('equipment input', async ({ formBPage }) => {
    const researchEquipmentsSection = formBPage.sections.researchEquipmentsSection;
    await researchEquipmentsSection.addEquipmentButton.click();
    const equipmentRow = researchEquipmentsSection.equipmentRow('first');

    await formBPage.submitForm();
    await expect(formBPage.submissionApprovedMessage).toBeHidden();

    touchInput(equipmentRow.nameInput);
    await expect(equipmentRow.nameInput.errors.required).toBeVisible();

    await equipmentRow.nameInput.fill('Jakiś sprzęt');
    await expect(equipmentRow.nameInput.errors.required).toBeHidden();

    await formBPage.submitForm({ expectedResult: 'valid' });
  });
});
