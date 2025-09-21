import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAResearchAreaSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly researchAreaDropdown: FormDropdown;
  public readonly additionalInfoInput: Locator;

  public readonly noResearchAreaChosenMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '4. Rejon prowadzenia badań');
    this.researchAreaDropdown = new FormDropdown(
      this.sectionDiv.locator('button:below(:text("Rejon prowadzenia badań"))').first()
    );
    this.additionalInfoInput = this.sectionDiv.locator('input:below(:text("Informacje dodatkowe"))').first();
    this.noResearchAreaChosenMessage = this.sectionDiv
      .getByText('Obszar badań musi być jednym z dostępnych obszarów badań')
      .first();
  }

  public async defaultFill() {
    await this.researchAreaDropdown.selectOption('Głębia Gdańska');
    await this.additionalInfoInput.fill('Dodatkowe informacje dotyczące rejonu badań.');
  }
}
