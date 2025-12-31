import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBAdditionalPermissionsSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addPermissionButton: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-additional-permissions-section');
    this.addPermissionButton = this.sectionDiv.getByTestId('form-b-add-permission-btn');
  }

  public permissionRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public permissionRow(index: 'first' | 'last' | number) {
    const rowLocator = this.permissionRowLocator(index);
    return {
      descriptionInput: new FormInput(rowLocator.getByTestId('permission-description-input'), {
        errors: { required: rowLocator.getByTestId('permission-description-errors') },
      }),
      executiveInput: new FormInput(rowLocator.getByTestId('permission-executive-input'), {
        errors: { required: rowLocator.getByTestId('permission-executive-errors') },
      }),
      scanFileInput: {
        send: async (filePath: string) => this.sendScan(rowLocator, filePath),
        errors: { required: rowLocator.getByTestId('permission-scan-errors') },
      },
      deleteButton: rowLocator.locator('td').nth(4).getByRole('button').first(),
    };
  }

  async sendScan(rowLocator: Locator, filePath: string) {
    const sendButton = rowLocator.getByTestId('permission-scan-button');

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await sendButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  public async defaultFill() {}
}
