import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBResearchEquipmentsSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addEquipmentButton: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-research-equipments-section');
    this.addEquipmentButton = this.sectionDiv.getByTestId('form-b-add-research-equipment-btn');
  }

  public equipmentRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public equipmentRow(index: 'first' | 'last' | number) {
    const rowLocator = this.equipmentRowLocator(index);
    return {
      nameInput: new FormInput(rowLocator.getByTestId('research-equipment-name-input'), {
        errors: { required: rowLocator.getByTestId('research-equipment-name-errors') },
      }),
      insuranceStartDateDropdown: new FormDropdown(rowLocator.getByTestId('research-equipment-insurance-start-button'), {
        variant: 'datetime-picker',
      }),
      insuranceEndDateDropdown: new FormDropdown(rowLocator.getByTestId('research-equipment-insurance-end-button'), {
        variant: 'datetime-picker',
      }),
      permissionCheckbox: rowLocator.locator('td').nth(4).getByRole('checkbox').first(),
    };
  }

  public async defaultFill() { }
}
