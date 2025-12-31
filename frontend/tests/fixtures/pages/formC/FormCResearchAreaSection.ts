import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCResearchAreaSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly researchAreaDropdown: FormDropdown;
  public readonly additionalInfoInput: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-c-research-area-section');
    this.researchAreaDropdown = new FormDropdown(
      this.sectionDiv.locator('button:below(:text("Rejon prowadzenia badań"))').first()
    );
    this.additionalInfoInput = this.sectionDiv.locator('input:below(:text("Informacje dodatkowe"))').first();
  }

  public async defaultFill() {}
}
