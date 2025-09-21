import type { Locator, Page } from '@playwright/test';
import { locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAPermissionsSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addPermissionButton: Locator;

  public readonly descriptionRequiredMessage: Locator;
  public readonly executiveRequiredMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '3. Dodatkowe pozwolenia do planowanych podczas rejsu badań');
    this.addPermissionButton = this.sectionDiv.getByRole('button', { name: 'Dodaj pozwolenie' });
    this.descriptionRequiredMessage = this.sectionDiv.getByText('Treść pozwolenia jest wymagany').first();
    this.executiveRequiredMessage = this.sectionDiv.getByText('Organ wydający jest wymagany').first();
  }

  public permissionRow(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public desctiptionInput(index: 'first' | 'last' | number) {
    const rowLocator = this.permissionRow(index);
    return rowLocator.getByRole('textbox').nth(0);
  }

  public executiveInput(index: 'first' | 'last' | number) {
    const rowLocator = this.permissionRow(index);
    return rowLocator.getByRole('textbox').nth(1);
  }

  public async addPermission(description: string, executive: string) {
    await this.addPermissionButton.click();
    await (await this.desctiptionInput('last')).fill(description);
    await (await this.executiveInput('last')).fill(executive);
  }

  public async defaultFill() {} // Optional section
}
