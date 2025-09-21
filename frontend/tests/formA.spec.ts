import { expect } from '@playwright/test';

import { MOCK_PDF_FILEPATH } from './fixtures/consts';
import { formTest as test } from './fixtures/fixtures';
import { touchInput } from './utils/form-filling-utils';

test('valid form A', async ({ formAPage }) => {
  await formAPage.fillForm(); // Fill the form with default values
  await formAPage.submitForm({ expectedResult: 'valid' });
});

test.describe('cruise manager info section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['cruiseManagerInfoSection'] });
  });

  test('cruise assistant not set', async ({ formAPage }) => {
    // when the assistant is not set, the form should be invalid
    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(formAPage.sections.cruiseManagerInfoSection.missingDeputyManagerMessage).toBeVisible();

    // correctly select the assistant after failed verification
    await formAPage.sections.cruiseManagerInfoSection.deputyManagerDropdown.selectOption('Kierownik Kierowniczy');
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise length section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['cruiseLengthSection'] });
  });

  // allowed cruise days count is in range (0-60] (right-side inclusive)
  test.describe('planned cruise days constrains', () => {
    [
      [false, 0],
      [false, 61],
      [false, 100],
      [true, 1],
      [true, 45],
      [true, 59],
      [true, 60],
    ].forEach(([isValid, val]) => {
      test(`${isValid ? 'valid' : 'invalid'}-${val}`, async ({ formAPage }) => {
        await formAPage.sections.cruiseLengthSection.defaultFill();
        await formAPage.sections.cruiseLengthSection.cruiseDaysInput.fill(val.toString());

        if (isValid) {
          await formAPage.submitForm({ expectedResult: 'valid' });
        } else {
          await expect(formAPage.sections.cruiseLengthSection.invalidCruiseDurationMessage).toBeVisible();
          await formAPage.submitForm({ expectedResult: 'invalid' });
        }
      });
    });
  });

  // allowed cruise hours count is in range (0-1440] (right-side inclusive)
  test.describe('planned cruise hours constrains', () => {
    [
      [false, 0],
      [false, 1441],
      [false, 1500],
      [true, 1],
      [true, 1000],
      [true, 1439],
      [true, 1440],
    ].forEach(([isValid, val]) => {
      test(`${isValid ? 'valid' : 'invalid'}-${val}`, async ({ formAPage }) => {
        await formAPage.sections.cruiseLengthSection.defaultFill();
        await formAPage.sections.cruiseLengthSection.cruiseHoursInput.fill(val.toString());

        if (isValid) {
          await formAPage.submitForm({ expectedResult: 'valid' });
        } else {
          await expect(formAPage.sections.cruiseLengthSection.invalidCruiseDurationMessage).toBeVisible();
          await formAPage.submitForm({ expectedResult: 'invalid' });
        }
      });
    });
  });

  test('alternative ship usage', async ({ formAPage }) => {
    await formAPage.sections.cruiseLengthSection.defaultFill();
    await formAPage.sections.cruiseLengthSection.shipUsageDropdown.selectOption('w inny sposób');

    await touchInput(formAPage.sections.cruiseLengthSection.alternativeShipUsageInput);
    await expect(formAPage.sections.cruiseLengthSection.emptyAlternativeShipUsageMessage).toBeVisible();

    await formAPage.submitForm();
    await expect(formAPage.submissionApprovedMessage, 'form should not be approved').toBeHidden();

    // correctly fill out different usage field
    await formAPage.sections.cruiseLengthSection.alternativeShipUsageInput.fill('jakieś inne użycie');
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('permissions section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['permissionsSection'] });
  });

  test('no permissions', async ({ formAPage }) => {
    await formAPage.submitForm({ expectedResult: 'valid' });
  });

  test('empty permission', async ({ formAPage }) => {
    const permissionsSection = formAPage.sections.permissionsSection;
    await permissionsSection.addPermission('', '');
    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(permissionsSection.descriptionRequiredMessage).toBeVisible();
    await expect(permissionsSection.executiveRequiredMessage).toBeVisible();

    await permissionsSection.desctiptionInput('first').fill('jakiś opis');
    await expect(permissionsSection.descriptionRequiredMessage).toBeHidden();
    await permissionsSection.executiveInput('first').fill('jakiś organ');
    await expect(permissionsSection.executiveRequiredMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('research area section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['researchAreaSection'] });
  });

  test('no research area chosen', async ({ formAPage }) => {
    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(formAPage.sections.researchAreaSection.noResearchAreaChosenMessage).toBeVisible();

    await formAPage.sections.researchAreaSection.researchAreaDropdown.selectOption('Ujście Wisły');
    await expect(formAPage.sections.researchAreaSection.noResearchAreaChosenMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('cruise goal section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['cruiseGoalSection'] });
  });

  test('no cruise goal chosen', async ({ formAPage }) => {
    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(formAPage.sections.cruiseGoalSection.noCruiseGoalChosenMessage).toBeVisible();

    await formAPage.sections.cruiseGoalSection.cruiseGoalDropdown.selectOption('Komercyjny');
    await expect(formAPage.sections.cruiseGoalSection.noCruiseGoalChosenMessage).toBeHidden();
  });

  test('empty goal description', async ({ formAPage }) => {
    const cruiseGoalSection = formAPage.sections.cruiseGoalSection;
    await cruiseGoalSection.cruiseGoalDropdown.selectOption('Komercyjny');

    await touchInput(cruiseGoalSection.cruiseGoalDescriptionInput);
    await expect(cruiseGoalSection.noCruiseGoalDescriptionMessage).toBeVisible();

    await formAPage.submitForm();
    await expect(formAPage.submissionApprovedMessage, 'form should not be approved').toBeHidden();

    await cruiseGoalSection.cruiseGoalDescriptionInput.fill('Jakiś opis');
    await expect(cruiseGoalSection.noCruiseGoalDescriptionMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('research tasks section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['researchTasksSection'] });
  });

  test('no research tasks', async ({ formAPage }) => {
    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(formAPage.sections.researchTasksSection.noResearchTasksMessage).toBeVisible();

    await formAPage.sections.researchTasksSection.addNewTaskDropdown.selectOption('Praca magisterska');
    await expect(formAPage.sections.researchTasksSection.noResearchTasksMessage).toBeHidden();
  });

  test('no author and title', async ({ formAPage }) => {
    const researchTasksSection = formAPage.sections.researchTasksSection;
    await researchTasksSection.addNewTaskDropdown.selectOption('Praca doktorska');

    // for the 'empty' message to appear, the field must be detected as touched, so it is filled with some value at first
    await touchInput(researchTasksSection.authorInput('first'));
    await touchInput(researchTasksSection.titleInput('first'));

    await expect(researchTasksSection.emptyAuthorMessage).toBeVisible();
    await expect(researchTasksSection.emptyTitleMessage).toBeVisible();

    await formAPage.submitForm();
    await expect(formAPage.submissionApprovedMessage, 'form should not be approved').toBeHidden();

    await researchTasksSection.authorInput('first').fill('Jakiś autor');
    await expect(researchTasksSection.emptyAuthorMessage).toBeHidden();
    await researchTasksSection.titleInput('first').fill('Jakiś tytuł');
    await expect(researchTasksSection.emptyTitleMessage).toBeHidden();

    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('contracts section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['contractsSection'] });
  });

  test('no contracts', async ({ formAPage }) => {
    await formAPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing data', async ({ formAPage }) => {
    const contractsSection = formAPage.sections.contractsSection;
    await contractsSection.addNewContractDropdown.selectOption('Międzynarodowa');
    const contractRow = contractsSection.contractRow('first');

    await formAPage.submitForm();
    await expect(formAPage.submissionApprovedMessage).toBeHidden();

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

    await formAPage.submitForm({ expectedResult: 'invalid' });

    await expect(contractRow.scanFileInput.errors.required).toBeVisible();

    await contractRow.scanFileInput.send(MOCK_PDF_FILEPATH);
    await expect(contractRow.scanFileInput.errors.required).toBeHidden();

    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('members section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['membersSection'] });
  });

  test('missing UG team', async ({ formAPage }) => {
    const membersSection = formAPage.sections.membersSection;
    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(membersSection.noUGUnitsMessage).toBeVisible();

    await membersSection.addUGUnitDropdown.selectOption('Biuro Prawne (0300)');
    await expect(membersSection.noUGUnitsMessage).toBeHidden();
  });

  ['employees', 'students'].forEach((whoToIncrease) => {
    test(`invalid UG team members count - ${whoToIncrease}`, async ({ formAPage }) => {
      const membersSection = formAPage.sections.membersSection;
      await membersSection.addUGUnitDropdown.selectOption('Biuro Prawne (0300)');
      await formAPage.submitForm({ expectedResult: 'invalid' });
      await expect(membersSection.invalidUGNofMembersMessage).toBeVisible();

      if (whoToIncrease == 'employees') {
        await membersSection.ugUnitRow('first').noOfEmployeesInput.fill('1');
      } else {
        await membersSection.ugUnitRow('first').noOfStudentsInput.fill('1');
      }

      await expect(membersSection.invalidUGNofMembersMessage).toBeHidden();
      await formAPage.submitForm({ expectedResult: 'valid' });
    });
  });

  test('guest team input', async ({ formAPage }) => {
    const membersSection = formAPage.sections.membersSection;
    await membersSection.addUGUnitDropdown.selectOption('Biuro Prawne (0300)');
    await membersSection.ugUnitRow('first').noOfEmployeesInput.fill('1');
    await membersSection.addNewGuestTeamButton.click();

    await touchInput(membersSection.guestTeamRow('first').teamNameInput);
    await expect(membersSection.emptyGuestTeamNameMessage).toBeVisible();

    await membersSection.guestTeamRow('first').teamNameInput.fill('Jakiś zespół');
    await expect(membersSection.emptyGuestTeamNameMessage).toBeHidden();

    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(membersSection.invalidGuestTeamCountMessage).toBeVisible();

    await membersSection.guestTeamRow('first').noOfPeopleInput.fill('1');
    await expect(membersSection.invalidGuestTeamCountMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('publications section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['publicationsSection'] });
  });

  test('no publications', async ({ formAPage }) => {
    await formAPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing publication data', async ({ formAPage }) => {
    const publicationsSection = formAPage.sections.publicationsSection;
    await publicationsSection.addPublicationDropdown.selectOption('Temat');

    await formAPage.submitForm();
    await expect(formAPage.submissionApprovedMessage, 'form should not be approved').toBeHidden();

    // for the 'empty' message to appear, the field must be detected as touched, so it is filled with some value at first
    const inputFields = [
      publicationsSection.doiInput('first'),
      publicationsSection.titleInput('first'),
      publicationsSection.authorsInput('first'),
      publicationsSection.magazineInput('first'),
    ];
    for (const inputField of inputFields) {
      await touchInput(inputField);
    }

    await expect(publicationsSection.emptyDoiMessage).toBeVisible();
    await expect(publicationsSection.emptyTitleMessage).toBeVisible();
    await expect(publicationsSection.emptyAuthorsMessage).toBeVisible();
    await expect(publicationsSection.emptyMagazineMessage).toBeVisible();

    await publicationsSection.doiInput('first').fill('Jakieś doi');
    await expect(publicationsSection.emptyDoiMessage).toBeHidden();

    await publicationsSection.titleInput('first').fill('Jakiś tytuł');
    await expect(publicationsSection.emptyTitleMessage).toBeHidden();

    await publicationsSection.authorsInput('first').fill('Jakiś autor');
    await expect(publicationsSection.emptyAuthorsMessage).toBeHidden();

    await publicationsSection.magazineInput('first').fill('Jakiś magazyn');
    await expect(publicationsSection.emptyMagazineMessage).toBeHidden();

    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(publicationsSection.emptyYearMessage).toBeVisible();

    await publicationsSection.chooseYearDropdown('first').selectOption('2025');
    await expect(publicationsSection.emptyYearMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('SPUB tasks section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['spubTasksSection'] });
  });

  test('no SPUB tasks', async ({ formAPage }) => {
    await formAPage.submitForm({ expectedResult: 'valid' });
  });

  test('missing SPUB task data', async ({ formAPage }) => {
    const spubTasksSection = formAPage.sections.spubTasksSection;
    await spubTasksSection.addNewTaskButton.click();
    const taskRow = spubTasksSection.taskRow('first');

    await touchInput(taskRow.nameInput);
    await expect(taskRow.nameInput.errors.required).toBeVisible();

    await taskRow.nameInput.fill('Jakieś zadanie');
    await expect(taskRow.nameInput.errors.required).toBeHidden();

    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(taskRow.startYearDropdown.errors.required).toBeVisible();
    await expect(taskRow.endYearDropdown.errors.required).toBeVisible();

    await taskRow.startYearDropdown.selectOption('2023');
    await expect(taskRow.startYearDropdown.errors.required).toBeHidden();

    await taskRow.endYearDropdown.selectOption('2025');
    await expect(taskRow.endYearDropdown.errors.required).toBeHidden();

    await formAPage.submitForm({ expectedResult: 'valid' });
  });
});

test.describe('supervisor info section tests', () => {
  test.beforeEach(async ({ formAPage }) => {
    await formAPage.fillForm({ except: ['supervisorInfoSection'] });
  });

  test('missing supervisor email', async ({ formAPage }) => {
    const supervisorInfoSection = formAPage.sections.supervisorInfoSection;
    await formAPage.submitForm({ expectedResult: 'invalid' });
    await expect(supervisorInfoSection.missingEmailMessage).toBeVisible();

    await supervisorInfoSection.supervisorEmailInput.fill('mail@gmail.com');
    await expect(supervisorInfoSection.missingEmailMessage).toBeHidden();
    await formAPage.submitForm({ expectedResult: 'valid' });
  });

  test.describe('email validation', () => {
    const cases: [string, boolean][] = [
      ['abcd', false],
      ['abcd@', false],
      ['abcd@gmail', false],
      ['abcd@gmail.com', true],
      ['abcd@wp.pl', true],
      ['abc+def@gmail.com', true],
    ];
    cases.forEach(([email, isValid]) => {
      test(`email validation - ${email}`, async ({ formAPage }) => {
        const supervisorInfoSection = formAPage.sections.supervisorInfoSection;
        await supervisorInfoSection.supervisorEmailInput.fill(email);
        if (isValid) {
          await formAPage.submitForm({ expectedResult: 'valid' });
        } else {
          await formAPage.submitForm();
          await expect(formAPage.submissionApprovedMessage, 'form should not be approved').toBeHidden();
        }
      });
    });
  });
});
