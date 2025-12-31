import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAMembersSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addUGUnitDropdown: FormDropdown;
  public readonly addNewGuestTeamButton: Locator;
  public readonly addHistoricalTeamDropdown: FormDropdown;

  public readonly noUGUnitsMessage: Locator;
  public readonly invalidUGNofMembersMessage: Locator;
  public readonly emptyGuestTeamNameMessage: Locator;
  public readonly invalidGuestTeamCountMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-members-section');
    this.addUGUnitDropdown = new FormDropdown(this.page.getByTestId('form-a-add-ug-unit-btn'), {
      variant: 'menu-with-buttons',
    });
    this.addNewGuestTeamButton = this.page.getByTestId('form-a-add-guest-team-btn');
    this.addHistoricalTeamDropdown = new FormDropdown(this.page.getByTestId('form-a-add-historical-team-btn'));
    this.noUGUnitsMessage = this.page
      .getByTestId('form-a-ug-teams-errors')
      .getByText('Co najmniej jeden zespół UG jest wymagany');
    this.invalidUGNofMembersMessage = this.page
      .getByTestId('form-a-ug-teams-errors')
      .getByText('Zespół UG musi składać się z co najmniej jednej osoby');
    this.emptyGuestTeamNameMessage = this.sectionDiv.getByText('Instytucja jest wymagana');
    this.invalidGuestTeamCountMessage = this.sectionDiv.getByText('Liczba osób musi być liczbą większą od 0');
  }

  public ugUnitRowLocator(index: 'first' | 'last' | number) {
    const table = this.page.getByTestId('form-a-ug-teams-table');
    const rowsLocator = table.getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public ugUnitRow(index: 'first' | 'last' | number) {
    const rowLocator = this.ugUnitRowLocator(index);
    return {
      noOfEmployeesInput: rowLocator.getByRole('textbox').nth(0),
      noOfStudentsInput: rowLocator.getByRole('textbox').nth(1),
    };
  }

  public guestTeamRowLocator(index: 'first' | 'last' | number) {
    const table = this.page.getByTestId('form-a-guest-teams-table');
    const rowsLocator = table.getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public guestTeamRow(index: 'first' | 'last' | number) {
    const rowLocator = this.guestTeamRowLocator(index);
    return {
      teamNameInput: rowLocator.getByRole('textbox').nth(0),
      noOfPeopleInput: rowLocator.getByRole('textbox').nth(1),
    };
  }

  public async defaultFill() {
    await this.addUGUnitDropdown.selectOption('Rektor (0000)');
    await this.ugUnitRow('first').noOfEmployeesInput.fill('1');
  }
}
