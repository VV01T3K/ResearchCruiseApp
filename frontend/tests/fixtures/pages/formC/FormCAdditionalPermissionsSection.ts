import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCAdditionalPermissionsSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addPermissionButton: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(
      formPage.page,
      '4. Dodatkowe pozwolenia do przeprowadzonych w trakcie rejsu badań'
    );
    this.addPermissionButton = this.sectionDiv.getByRole('button', { name: 'Dodaj pozwolenie' });
  }

  public permissionRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public permissionRow(index: 'first' | 'last' | number) {
    const rowLocator = this.permissionRowLocator(index);
    return {
      descriptionInput: new FormInput(rowLocator.getByRole('textbox').nth(0), {
        errors: { required: rowLocator.getByText('Treść pozwolenia jest wymagany') },
      }),
      executiveInput: new FormInput(rowLocator.getByRole('textbox').nth(1), {
        errors: { required: rowLocator.getByText('Organ wydający jest wymagany') },
      }),
      scanFileInput: {
        send: async (filePath: string) => this.sendScan(rowLocator, filePath),
        errors: { required: rowLocator.getByText('Plik jest wymagany') },
      },
      deleteButton: rowLocator.locator('td').nth(4).getByRole('button').first(),
    };
  }

  async sendScan(rowLocator: Locator, filePath: string) {
    const sendButton = rowLocator.getByRole('cell', { name: 'Kliknij lub przeciągnij plik' });

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await sendButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  public async defaultFill() {}
}
