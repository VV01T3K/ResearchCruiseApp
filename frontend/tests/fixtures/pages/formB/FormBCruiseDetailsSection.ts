import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBCruiseDetailsSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addEquipmentButton: Locator;
  public readonly addEquipmentActionDropdown: FormDropdown;
  public readonly addPortButton: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-cruise-details-section');
    this.addEquipmentButton = this.sectionDiv.getByTestId('form-b-add-short-equipment-btn');
    this.addEquipmentActionDropdown = new FormDropdown(this.sectionDiv.getByTestId('form-b-add-long-equipment-btn'), {
      variant: 'menu-with-buttons',
    });
    this.addPortButton = this.sectionDiv.getByTestId('form-b-add-port-btn');
  }

  public equipmentRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public equipmentRow(index: 'first' | 'last' | number) {
    const rowLocator = this.equipmentRowLocator(index);
    return {
      fromDateDropdown: new FormDropdown(rowLocator.getByTestId('short-equipment-from-button'), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByTestId('short-equipment-from-errors') },
      }),
      toDateDropdown: new FormDropdown(rowLocator.getByTestId('short-equipment-to-button'), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByTestId('short-equipment-to-errors') },
      }),
      nameInput: new FormInput(rowLocator.getByTestId('short-equipment-name-input'), {
        errors: { required: rowLocator.getByTestId('short-equipment-name-errors') },
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
      timeInput: new FormInput(rowLocator.getByTestId('long-equipment-duration-input'), {
        errors: { required: rowLocator.getByTestId('long-equipment-duration-errors') },
      }),
      nameInput: new FormInput(rowLocator.getByTestId('long-equipment-name-input'), {
        errors: { required: rowLocator.getByTestId('long-equipment-name-errors') },
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
      fromDateDropdown: new FormDropdown(rowLocator.getByTestId('port-from-button'), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByTestId('port-from-errors') },
      }),
      toDateDropdown: new FormDropdown(rowLocator.getByTestId('port-to-button'), {
        variant: 'datetime-picker',
        errors: { required: rowLocator.getByTestId('port-to-errors') },
      }),
      nameInput: new FormInput(rowLocator.getByTestId('port-name-input'), {
        errors: { required: rowLocator.getByTestId('port-name-errors') },
      }),
    };
  }

  public async defaultFill() {}
}
