import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCResearchEquipmentsSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addEquipmentButton: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '14. Lista sprzętu i aparatury badawczej użytej podczas rejsu');
    this.addEquipmentButton = this.sectionDiv.getByRole('button', { name: 'Dodaj sprzęt / aparaturę' });
  }

  public equipmentRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public equipmentRow(index: 'first' | 'last' | number) {
    const rowLocator = this.equipmentRowLocator(index);
    return {
      nameInput: new FormInput(rowLocator.locator('td').nth(1).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Nazwa jest wymagana') },
      }),
      insuranceStartDateDropdown: new FormDropdown(rowLocator.locator('td').nth(2).getByRole('button').first(), {
        variant: 'menu-with-buttons',
      }),
      insuranceEndDateDropdown: new FormDropdown(rowLocator.locator('td').nth(3).getByRole('button').first(), {
        variant: 'menu-with-buttons',
      }),
      permissionCheckbox: rowLocator.locator('td').nth(4).getByRole('checkbox').first(),
    };
  }

  public async defaultFill() {}
}
