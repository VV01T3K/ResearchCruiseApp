import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCMembersSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addUGUnitDropdown: FormDropdown;
  public readonly addNewGuestTeamButton: Locator;
  public readonly addHistoricalTeamDropdown: FormDropdown;

  public readonly noUGUnitsMessage: Locator;
  public readonly invalidUGNofMembersMessage: Locator;
  public readonly duplicateFacultyMessage: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '9. Zespoły badawcze, które uczestniczyły w rejsie');
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
    this.duplicateFacultyMessage = this.sectionDiv.getByText(
      'Nie można dodać dwóch zespołów UG z tego samego wydziału'
    );
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
      teamNameInput: new FormInput(rowLocator.getByRole('textbox').nth(0), {
        errors: { required: rowLocator.getByText('Instytucja jest wymagana') },
      }),
      noOfPeopleInput: new FormInput(rowLocator.getByRole('textbox').nth(1), {
        errors: { invalidValue: rowLocator.getByText('Liczba osób musi być liczbą większą od 0') },
      }),
    };
  }

  public async defaultFill() {}
}
