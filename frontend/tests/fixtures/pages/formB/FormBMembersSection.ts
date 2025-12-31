import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBMembersSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addUGUnitDropdown: FormDropdown;
  public readonly addNewGuestTeamButton: Locator;
  public readonly addHistoricalTeamDropdown: FormDropdown;
  public readonly addPermissionButton: Locator;

  public readonly noUGUnitsMessage: Locator;
  public readonly invalidUGNofMembersMessage: Locator;
  public readonly duplicateFacultyMessage: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-members-section');
    this.addUGUnitDropdown = new FormDropdown(this.sectionDiv.getByTestId('form-b-add-ug-unit-btn'), {
      variant: 'menu-with-buttons',
    });
    this.addNewGuestTeamButton = this.sectionDiv.getByTestId('form-b-add-guest-team-btn');
    this.addHistoricalTeamDropdown = new FormDropdown(
      this.sectionDiv.getByTestId('form-b-add-historical-guest-team-btn')
    );
    this.addPermissionButton = this.sectionDiv.getByTestId('form-b-add-crew-member-btn');

    // Section-level validation errors are exposed as an errors list; avoid matching exact text.
    this.noUGUnitsMessage = this.sectionDiv.getByTestId('form-b-ug-teams-errors');
    this.invalidUGNofMembersMessage = this.sectionDiv.getByTestId('form-b-ug-teams-errors');
    this.duplicateFacultyMessage = this.sectionDiv.getByTestId('form-b-ug-teams-errors');
  }

  public ugUnitRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public ugUnitRow(index: 'first' | 'last' | number) {
    const rowLocator = this.ugUnitRowLocator(index);
    return {
      noOfEmployeesInput: rowLocator.getByRole('textbox').nth(0),
      noOfStudentsInput: rowLocator.getByRole('textbox').nth(1),
      deleteButton: rowLocator.locator('td').nth(4).getByRole('button'),
    };
  }

  public guestTeamRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(1).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public guestTeamRow(index: 'first' | 'last' | number) {
    const rowLocator = this.guestTeamRowLocator(index);
    return {
      teamNameInput: new FormInput(rowLocator.getByTestId('guest-team-name-input'), {
        errors: { required: rowLocator.getByTestId('guest-team-name-errors') },
      }),
      noOfPeopleInput: new FormInput(rowLocator.getByTestId('guest-team-people-input'), {
        errors: { invalidValue: rowLocator.getByTestId('guest-team-people-errors') },
      }),
    };
  }

  public permissionRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(2).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public permissionRow(index: 'first' | 'last' | number) {
    const rowLocator = this.permissionRowLocator(index);
    return {
      titleInput: new FormInput(rowLocator.getByTestId('crew-member-title-input'), {
        errors: { required: rowLocator.getByTestId('crew-member-title-errors') },
      }),
      namesInput: new FormInput(rowLocator.getByTestId('crew-member-names-input'), {
        errors: { required: rowLocator.getByTestId('crew-member-names-errors') },
      }),
      surnameInput: new FormInput(rowLocator.getByTestId('crew-member-surname-input'), {
        errors: { required: rowLocator.getByTestId('crew-member-surname-errors') },
      }),
      birthplaceInput: new FormInput(rowLocator.getByTestId('crew-member-birthplace-input'), {
        errors: { required: rowLocator.getByTestId('crew-member-birthplace-errors') },
      }),
      documentIdInput: new FormInput(rowLocator.getByTestId('crew-member-document-id-input'), {
        errors: { required: rowLocator.getByTestId('crew-member-document-id-errors') },
      }),
      birthdayDropdown: new FormDropdown(rowLocator.getByTestId('crew-member-birthdate-button'), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByTestId('crew-member-birthdate-errors') },
      }),
      documentExpirationDateDropdown: new FormDropdown(rowLocator.getByTestId('crew-member-document-expiry-button'), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByTestId('crew-member-document-expiry-errors') },
      }),
      unitNameInput: new FormInput(rowLocator.getByTestId('crew-member-institution-input'), {
        errors: { required: rowLocator.getByTestId('crew-member-institution-errors') },
      }),
    };
  }

  public async defaultFill() {}
}
