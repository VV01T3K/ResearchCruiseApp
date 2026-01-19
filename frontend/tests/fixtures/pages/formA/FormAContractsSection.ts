import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAContractsSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addNewContractDropdown: FormDropdown;
  public readonly addHistoricalContractDropdown: FormDropdown;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-contracts-section');
    this.addNewContractDropdown = new FormDropdown(this.sectionDiv.getByTestId('form-a-add-contract-btn-button'), {
      variant: 'menu-with-buttons',
    });
    this.addHistoricalContractDropdown = new FormDropdown(
      this.sectionDiv.getByTestId('form-a-add-historical-contract-btn-button')
    );
  }

  public contractRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public contractRow(index: 'first' | 'last' | number) {
    const rowLocator = this.contractRowLocator(index);
    return {
      institutionNameInput: new FormInput(rowLocator.locator('input:below(:text("Nazwa instytucji"))').first(), {
        errors: { required: rowLocator.getByText('Nazwa instytucji jest wymagana') },
      }),
      institutionUnitInput: new FormInput(rowLocator.locator('input:below(:text("Jednostka"))').first(), {
        errors: { required: rowLocator.getByText('Jednostka jest wymagana') },
      }),
      institutionLocationInput: new FormInput(
        rowLocator.locator('input:below(:text("Lokalizacja instytucji"))').first(),
        { errors: { required: rowLocator.getByText('Lokalizacja instytucji jest wymagana') } }
      ),
      descriptionInput: new FormInput(rowLocator.locator('input:below(:text("Opis"))').first(), {
        errors: { required: rowLocator.getByText('Opis jest wymagany') },
      }),
      scanFileInput: {
        send: async (filePath: string) => this.sendScan(rowLocator, filePath),
        errors: { required: rowLocator.getByText('Plik jest wymagany') },
      },
    };
  }

  private async sendScan(contractRow: Locator, filePath: string) {
    const sendButton = contractRow.locator(':below(:text("Skan"))').first();

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await sendButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  public async defaultFill() {}
}
