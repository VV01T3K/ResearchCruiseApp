import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

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
    this.sectionDiv = locateSectionDiv(formPage.page, '9. Zespoły badawcze, które miałyby uczestniczyć w rejsie');
    this.addUGUnitDropdown = new FormDropdown(this.sectionDiv.getByRole('button', { name: 'Dodaj jednostkę UG' }), {
      variant: 'menu-with-buttons',
    });
    this.addNewGuestTeamButton = this.sectionDiv.getByRole('button', { name: 'Dodaj nowy zespół' });
    this.addHistoricalTeamDropdown = new FormDropdown(
      this.sectionDiv.getByRole('button', { name: 'Dodaj historyczny zespół' })
    );
    this.addPermissionButton = this.sectionDiv.getByRole('button', { name: 'Dodaj pozwolenie' });
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

  public permissionRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(2).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public permissionRow(index: 'first' | 'last' | number) {
    const rowLocator = this.permissionRowLocator(index);
    return {
      titleInput: new FormInput(rowLocator.locator('input:below(:text("Tytuł"))').first(), {
        errors: { required: rowLocator.getByText('Tytuł jest wymagany') },
      }),
      namesInput: new FormInput(rowLocator.locator('input:below(:text("Imiona"))').first(), {
        errors: { required: rowLocator.getByText('Imię jest wymagane') },
      }),
      surnameInput: new FormInput(rowLocator.locator('input:below(:text("Nazwisko"))').first(), {
        errors: { required: rowLocator.getByText('Nazwisko jest wymagane') },
      }),
      birthplaceInput: new FormInput(rowLocator.locator('input:below(:text("Miejsce urodzenia"))').first(), {
        errors: { required: rowLocator.getByText('Miejsce urodzenia jest wymagane') },
      }),
      documentIdInput: new FormInput(rowLocator.locator('input:below(:text("Numer ID dokumentu"))').first(), {
        errors: { required: rowLocator.getByText('Numer dokumentu jest wymagany') },
      }),
      birthdayDropdown: new FormDropdown(rowLocator.locator('button:below(:text("Data urodzenia"))').first(), {
        variant: 'menu-with-buttons',
        errors: { required: rowLocator.getByText('Data urodzenia jest wymagana') },
      }),
      documentExpirationDateDropdown: new FormDropdown(
        rowLocator.locator('button:below(:text("Data ważności dokumentu"))').first(),
        {
          variant: 'menu-with-buttons',
          errors: { required: rowLocator.getByText('Data ważności dokumentu jest wymagana') },
        }
      ),
      unitNameInput: new FormInput(rowLocator.getByRole('textbox').nth(5), {
        errors: { required: rowLocator.getByText('Instytucja jest wymagana') },
      }),
    };
  }

  public async defaultFill() {}
}
