import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCCruiseDetailsSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addEquipmentButton: Locator;
  public readonly addEquipmentActionDropdown: FormDropdown;
  public readonly addPortButton: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '12. Szczegóły rejsu');
    this.addEquipmentButton = this.sectionDiv.getByRole('button', { name: 'Dodaj sprzęt' });
    this.addEquipmentActionDropdown = new FormDropdown(this.sectionDiv.getByRole('button', { name: 'Dodaj nowe' }), {
      variant: 'menu-with-buttons',
    });
    this.addPortButton = this.sectionDiv.getByRole('button', { name: 'Dodaj port' });
  }

  public equipmentRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public equipmentRow(index: 'first' | 'last' | number) {
    const rowLocator = this.equipmentRowLocator(index);
    return {
      fromDateDropdown: new FormDropdown(rowLocator.locator('td').nth(1).getByRole('button').first(), {
        variant: 'menu-with-buttons',
        errors: { required: rowLocator.getByText('Data rozpoczęcia jest wymagana') },
      }),
      toDateDropdown: new FormDropdown(rowLocator.locator('td').nth(2).getByRole('button').first(), {
        variant: 'menu-with-buttons',
        errors: { required: rowLocator.getByText('Data zakończenia jest wymagana') },
      }),
      nameInput: new FormInput(rowLocator.getByRole('textbox').nth(0), {
        errors: { required: rowLocator.getByText('Nazwa sprzętu jest wymagana') },
      }),
    };
  }

  public equipmentActionRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(1).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public equipmentActionRow(index: 'first' | 'last' | number) {
    const rowLocator = this.equipmentActionRowLocator(index);
    return {
      actionDropdown: new FormDropdown(rowLocator.getByRole('button').nth(0)),
      timeInput: new FormInput(rowLocator.getByRole('textbox').nth(0), {
        errors: { required: rowLocator.getByText('Czas trwania jest wymagany') },
      }),
      nameInput: new FormInput(rowLocator.getByRole('textbox').nth(1), {
        errors: { required: rowLocator.getByText('Nazwa jest wymagana') },
      }),
    };
  }

  public portRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(2).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public portRow(index: 'first' | 'last' | number) {
    const rowLocator = this.portRowLocator(index);
    return {
      fromDateDropdown: new FormDropdown(rowLocator.locator('td').nth(1).getByRole('button').first(), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByText('Czas rozpoczęcia jest wymagany') },
      }),
      toDateDropdown: new FormDropdown(rowLocator.locator('td').nth(2).getByRole('button').first(), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByText('Czas zakończenia jest wymagany') },
      }),
      nameInput: new FormInput(rowLocator.getByRole('textbox').nth(0), {
        errors: { required: rowLocator.getByText('Nazwa jest wymagana') },
      }),
    };
  }

  public async defaultFill() {}
}
