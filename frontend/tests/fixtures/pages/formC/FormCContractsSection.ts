import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCContractsSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addNewContractDropdown: FormDropdown;
  public readonly addHistoricalContractDropdown: FormDropdown;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(
      formPage.page,
      '8. Umowy regulujące współpracę, w ramach której zostały zrealizowane zadania badawcze'
    );
    this.addNewContractDropdown = new FormDropdown(
      this.sectionDiv.locator('button', { hasText: 'Dodaj nowy kontrakt' }),
      { variant: 'menu-with-buttons' }
    );
    this.addHistoricalContractDropdown = new FormDropdown(
      this.sectionDiv.locator('button', { hasText: 'Dodaj historyczną umowę' })
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
