import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAResearchAreaSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addResearchAreaDropdown: FormDropdown;

  public readonly noResearchAreasMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-research-area-section');
    this.addResearchAreaDropdown = new FormDropdown(
      this.page.getByTestId('form-a-add-research-area-btn'),
      { variant: 'menu-with-buttons' }
    );
    this.noResearchAreasMessage = this.page.getByTestId('form-a-research-areas-errors');
  }

  public researchAreaRowLocator(index: 'first' | 'last' | number) {
    const table = this.page.getByTestId('form-a-research-areas-table');
    const rowsLocator = table.getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public researchAreaRow(index: 'first' | 'last' | number) {
    const rowLocator = this.researchAreaRowLocator(index);
    return {
      nameInput: new FormInput(rowLocator.getByRole('textbox').nth(0), {
        errors: { required: rowLocator.getByText('Nazwa rejonu badań nie może być pusta') },
      }),
      additionalInfoInput: new FormInput(rowLocator.getByRole('textbox').nth(1)),
    };
  }

  public async defaultFill() {
    await this.addResearchAreaDropdown.selectOption('Głębia Gdańska');
    await this.researchAreaRow('last').additionalInfoInput.fill('Dodatkowe informacje o rejonie badań');
  }
}
