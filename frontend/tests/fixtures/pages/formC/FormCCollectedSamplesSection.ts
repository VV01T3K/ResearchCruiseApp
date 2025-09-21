import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCCollectedSamplesSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addSampleButton: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '16. Lista próbek pobranych i poddanych analizie podczas rejsu');
    this.addSampleButton = this.sectionDiv.getByRole('button', { name: 'Dodaj próbkę' });
  }

  public sampleRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public sampleRow(index: 'first' | 'last' | number) {
    const rowLocator = this.sampleRowLocator(index);
    return {
      typeInput: new FormInput(rowLocator.locator('td').nth(0).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Typ próbki nie może być pusty') },
      }),
      quantityInput: new FormInput(rowLocator.locator('td').nth(1).getByRole('textbox').first(), {
        errors: { invalidValue: rowLocator.getByText('Ilość musi być liczbą dodatnią') },
      }),
      analysisInput: new FormInput(rowLocator.locator('td').nth(2).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Analiza próbki nie może być pusta') },
      }),
      publishingInput: new FormInput(rowLocator.locator('td').nth(3).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Publikacja próbki nie może być pusta') },
      }),
    };
  }

  public async defaultFill() {}
}
