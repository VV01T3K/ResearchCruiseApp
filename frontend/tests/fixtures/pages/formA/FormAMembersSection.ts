import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionDiv } from '@tests/utils/form-filling-utils';

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
    this.sectionDiv = locateSectionDiv(formPage.page, '8. Zespoły badawcze, które miałyby uczestniczyć w rejsie');
    this.addUGUnitDropdown = new FormDropdown(this.sectionDiv.getByRole('button', { name: 'Dodaj jednostkę UG' }), {
      variant: 'menu-with-buttons',
    });
    this.addNewGuestTeamButton = this.sectionDiv.getByRole('button', { name: 'Dodaj nowy zespół' });
    this.addHistoricalTeamDropdown = new FormDropdown(
      this.sectionDiv.getByRole('button', { name: 'Dodaj historyczny zespół' })
    );
    this.noUGUnitsMessage = this.sectionDiv.getByText('Co najmniej jeden zespół UG jest wymagany');
    this.invalidUGNofMembersMessage = this.sectionDiv.getByText(
      'Zespół UG musi składać się z co najmniej jednej osoby'
    );
    this.emptyGuestTeamNameMessage = this.sectionDiv.getByText('Instytucja jest wymagana');
    this.invalidGuestTeamCountMessage = this.sectionDiv.getByText('Liczba osób musi być liczbą większą od 0');
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
    };
  }

  public guestTeamRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(1).getByRole('row');
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
