import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormACruiseManagerInfoSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly cruiseManagerDropdown: FormDropdown;
  public readonly deputyManagerDropdown: FormDropdown;
  public readonly yearDropdown: FormDropdown;

  public readonly missingDeputyManagerMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-cruise-manager-section');
    this.cruiseManagerDropdown = new FormDropdown(
      this.page.getByTestId('form-a-cruise-manager-button')
    );
    this.deputyManagerDropdown = new FormDropdown(
      this.page.getByTestId('form-a-deputy-manager-button')
    );
    this.yearDropdown = new FormDropdown(this.page.getByTestId('form-a-year-button'));
    this.missingDeputyManagerMessage = this.page.getByTestId('form-a-deputy-manager-errors');
  }

  public async defaultFill() {
    await this.deputyManagerDropdown.selectOption('kierownik@o2.com');
    await this.yearDropdown.selectOption('2025');
  }
}
