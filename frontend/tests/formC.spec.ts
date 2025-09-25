import { expect } from '@playwright/test';
import { formTest as test } from '@tests/fixtures/fixtures';

import { MOCK_IMAGE_FILEPATH, MOCK_PDF_FILEPATH } from './fixtures/consts';
import { touchInput } from './utils/form-filling-utils';

test('valid form C', async ({ formCPage }) => {
  await formCPage.fillForm(); // Fill the form with default values
  await formCPage.submitForm({ expectedResult: 'valid' });
});

test.describe('additional permissions section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['additionalPermissionsSection'] });
  });

  test('no permissions added', async ({ formCPage }) => {
    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('add permission', async ({ formCPage }) => {
    const additionalPermissionsSection = formCPage.sections.additionalPermissionsSection;
    await additionalPermissionsSection.addPermissionButton.click();
    const permissionRow = additionalPermissionsSection.permissionRow('last');
    await permissionRow.descriptionInput.fill('Jakiś opis');
    await permissionRow.executiveInput.fill('Jakiś organ');
    await permissionRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing description and executive', async ({ formCPage }) => {
    const additionalPermissionsSection = formCPage.sections.additionalPermissionsSection;
    await additionalPermissionsSection.addPermissionButton.click();
    const permissionRow = additionalPermissionsSection.permissionRow('last');
    await permissionRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await formCPage.submitForm({ expectedResult: 'invalid' });

    await expect(permissionRow.descriptionInput.errors.required).toBeVisible();
    await expect(permissionRow.executiveInput.errors.required).toBeVisible();

    await permissionRow.descriptionInput.fill('Jakiś opis');
    await expect(permissionRow.descriptionInput.errors.required).toBeHidden();
    await permissionRow.executiveInput.fill('Jakiś organ');
    await expect(permissionRow.executiveInput.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing scan file', async ({ formCPage }) => {
    const additionalPermissionsSection = formCPage.sections.additionalPermissionsSection;
    await additionalPermissionsSection.addPermissionButton.click();
    const permissionRow = additionalPermissionsSection.permissionRow('last');
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

  test('checkboxes available only after marked as done', async ({ formCPage }) => {
    const researchTasksSection = formCPage.sections.researchTasksSection;
    const taskRow = researchTasksSection.taskRow('first');

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

  test('no contracts', async ({ formCPage }) => {
    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test.fixme('missing data', async ({ formCPage }) => {
    const contractsSection = formCPage.sections.contractsSection;
    await contractsSection.addNewContractDropdown.selectOption('Międzynarodowa');
    const contractRow = contractsSection.contractRow('first');

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    // for the 'empty' message to appear, the field must be detected as touched, so it is filled with some value at first
    const inputFields = [
      contractRow.institutionNameInput,
      contractRow.institutionUnitInput,
      contractRow.institutionLocationInput,
      contractRow.descriptionInput,
    ];
    for (const inputField of inputFields) {
      await touchInput(inputField);
      await expect(inputField.errors.required).toBeVisible();
    }

    for (const inputField of inputFields) {
      await expect(inputField.errors.required).toBeVisible();
      await inputField.fill('Wartość');
      await expect(inputField.errors.required).toBeHidden();
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

  test('duplicate faculty', async ({ formCPage }) => {
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

  test('guest team input', async ({ formCPage }) => {
    const membersSection = formCPage.sections.membersSection;
    await membersSection.addNewGuestTeamButton.click();
    const guestTeamRow = membersSection.guestTeamRow('first');

    // for the 'empty' message to appear, the field must be detected as touched, so it is filled with some value at first
    await touchInput(guestTeamRow.teamNameInput);
    await expect(guestTeamRow.teamNameInput.errors.required).toBeVisible();

    await guestTeamRow.teamNameInput.fill('Jakiś zespół');
    await expect(guestTeamRow.teamNameInput.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(guestTeamRow.noOfPeopleInput.errors.invalidValue).toBeVisible();

    await guestTeamRow.noOfPeopleInput.fill('1');
    await expect(guestTeamRow.noOfPeopleInput.errors.invalidValue).toBeHidden();
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('SPUB tasks section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['spubTasksSection'] });
  });

  test('no SPUB tasks', async ({ formCPage }) => {
    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing SPUB task data', async ({ formCPage }) => {
    const spubTasksSection = formCPage.sections.spubTasksSection;
    await spubTasksSection.addNewTaskButton.click();
    const taskRow = spubTasksSection.taskRow('first');

    await touchInput(taskRow.nameInput);
    await expect(taskRow.nameInput.errors.required).toBeVisible();

    await taskRow.nameInput.fill('Jakieś zadanie');
    await expect(taskRow.nameInput.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(taskRow.startYearDropdown.errors.required).toBeVisible();
    await expect(taskRow.endYearDropdown.errors.required).toBeVisible();

    await taskRow.startYearDropdown.selectOption('2023');
    await expect(taskRow.startYearDropdown.errors.required).toBeHidden();

    await taskRow.endYearDropdown.selectOption('2025');
    await expect(taskRow.endYearDropdown.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise details section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['cruiseDetailsSection'] });
  });

  test('equipment input', async ({ formCPage }) => {
    const cruiseDetailsSection = formCPage.sections.cruiseDetailsSection;
    await cruiseDetailsSection.addEquipmentButton.click();
    const equipmentRow = cruiseDetailsSection.equipmentRow('first');

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    touchInput(equipmentRow.nameInput);
    await expect(equipmentRow.nameInput.errors.required).toBeVisible();

    await equipmentRow.nameInput.fill('Jakiś sprzęt');
    await expect(equipmentRow.nameInput.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(equipmentRow.fromDateDropdown.errors.required).toBeVisible();
    await expect(equipmentRow.toDateDropdown.errors.required).toBeVisible();

    await equipmentRow.fromDateDropdown.selectOption('11');
    await expect(equipmentRow.fromDateDropdown.errors.required).toBeHidden();
    await equipmentRow.toDateDropdown.selectOption('13');
    await expect(equipmentRow.toDateDropdown.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('equipment action input', async ({ formCPage }) => {
    const cruiseDetailsSection = formCPage.sections.cruiseDetailsSection;
    await cruiseDetailsSection.addEquipmentActionDropdown.selectOption('Pozostawienie');
    const actionRow = cruiseDetailsSection.equipmentActionRow('first');

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    touchInput(actionRow.timeInput);
    await expect(actionRow.timeInput.errors.required).toBeVisible();
    touchInput(actionRow.nameInput);
    await expect(actionRow.nameInput.errors.required).toBeVisible();

    await actionRow.timeInput.fill('10');
    await expect(actionRow.timeInput.errors.required).toBeHidden();
    await actionRow.nameInput.fill('Jakaś nazwa');
    await expect(actionRow.nameInput.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('port input', async ({ formCPage }) => {
    const cruiseDetailsSection = formCPage.sections.cruiseDetailsSection;
    await cruiseDetailsSection.addPortButton.click();
    const portRow = cruiseDetailsSection.portRow('first');

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    touchInput(portRow.nameInput);
    await expect(portRow.nameInput.errors.required).toBeVisible();

    await portRow.nameInput.fill('Jakaś nazwa');
    await expect(portRow.nameInput.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'invalid' });
    await expect(portRow.fromDateDropdown.errors.required).toBeVisible();
    await expect(portRow.toDateDropdown.errors.required).toBeVisible();

    await portRow.fromDateDropdown.selectOption('11');
    await expect(portRow.fromDateDropdown.errors.required).toBeHidden();
    await portRow.toDateDropdown.selectOption('13');
    await expect(portRow.toDateDropdown.errors.required).toBeHidden();

    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise day details section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['cruiseDayDetailsSection'] });
  });

  test('task input', async ({ formCPage }) => {
    const cruiseDayDetailsSection = formCPage.sections.cruiseDayDetailsSection;
    await cruiseDayDetailsSection.addTaskButton.click();
    const taskRow = cruiseDayDetailsSection.taskRow('first');
    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    const inputFields = [taskRow.nameInput, taskRow.regionInput, taskRow.positionInput, taskRow.commentInput];

    for (const inputField of inputFields) {
      await touchInput(inputField);
      await expect(inputField.errors.required).toBeVisible();
    }

    for (const inputField of inputFields) {
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

  test('equipment input', async ({ formCPage }) => {
    const researchEquipmentsSection = formCPage.sections.researchEquipmentsSection;
    await researchEquipmentsSection.addEquipmentButton.click();
    const equipmentRow = researchEquipmentsSection.equipmentRow('first');

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    touchInput(equipmentRow.nameInput);
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

  test('sample inputs', async ({ formCPage }) => {
    const collectedSamplesSection = formCPage.sections.collectedSamplesSection;
    await collectedSamplesSection.addSampleButton.click();
    const sampleRow = collectedSamplesSection.sampleRow('first');

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    const inputFields = [sampleRow.typeInput, sampleRow.analysisInput, sampleRow.publishingInput];
    for (const inputField of inputFields) {
      await touchInput(inputField);
      await expect(inputField.errors.required).toBeVisible();
    }

    for (const inputField of inputFields) {
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

test.describe('SPUB report data section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['spubReportDataSection'] });
  });

  test('missing data', async ({ formCPage }) => {
    const spubReportDataSection = formCPage.sections.spubReportDataSection;

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    await spubReportDataSection.reportInput.fill('Jakiś raport');

    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('too long report', async ({ formCPage }) => {
    const LENGHT_LIMIT = 10240;

    const spubReportDataSection = formCPage.sections.spubReportDataSection;

    await spubReportDataSection.reportInput.fill('A'.repeat(LENGHT_LIMIT + 1));
    await expect(spubReportDataSection.reportInput.errors.tooLong).toBeVisible();
    await formCPage.submitForm({ expectedResult: 'invalid' });

    await spubReportDataSection.reportInput.fill('A'.repeat(LENGHT_LIMIT));
    await expect(spubReportDataSection.reportInput.errors.tooLong).toBeHidden();
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('additional description section tests', () => {
  test.beforeEach(async ({ formCPage }) => {
    await formCPage.fillForm({ except: ['additionalDescriptionSection'] });
  });

  test('missing description', async ({ formCPage }) => {
    const additionalDescriptionSection = formCPage.sections.additionalDescriptionSection;

    await formCPage.submitForm();
    await expect(formCPage.submissionApprovedMessage).toBeHidden();

    await additionalDescriptionSection.descriptionInput.fill('Jakiś opis');

    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('too long description', async ({ formCPage }) => {
    const LENGHT_LIMIT = 10240;

    const additionalDescriptionSection = formCPage.sections.additionalDescriptionSection;

    await additionalDescriptionSection.descriptionInput.fill('A'.repeat(LENGHT_LIMIT + 1));
    await expect(additionalDescriptionSection.descriptionInput.errors.tooLong).toBeVisible();
    await formCPage.submitForm({ expectedResult: 'invalid' });

    await additionalDescriptionSection.descriptionInput.fill('A'.repeat(LENGHT_LIMIT));
    await expect(additionalDescriptionSection.descriptionInput.errors.tooLong).toBeHidden();
    await formCPage.submitForm({ expectedResult: 'valid' });
  });

  test('attachment input', async ({ formCPage }) => {
    const additionalDescriptionSection = formCPage.sections.additionalDescriptionSection;
    await additionalDescriptionSection.descriptionInput.fill('Jakiś opis');
    await additionalDescriptionSection.sendAttachment([MOCK_PDF_FILEPATH, MOCK_IMAGE_FILEPATH, MOCK_IMAGE_FILEPATH]);
    await formCPage.submitForm({ expectedResult: 'valid' });
  });
});
