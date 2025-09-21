import type { Locator, Page } from '@playwright/test';
import { locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormASupervisorInfoSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly supervisorEmailInput: Locator;

  public readonly missingEmailMessage: Locator;
  public readonly invalidEmailMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '11. Dane kontaktowe przełożonego');
    this.supervisorEmailInput = this.sectionDiv.locator('input:below(:text("Adres e-mail przełożonego"))');
    this.missingEmailMessage = this.sectionDiv.getByText('Niepoprawny adres email');
    this.invalidEmailMessage = this.sectionDiv.getByText('Niepoprawny adres email');
  }

  public async defaultFill() {
    await this.supervisorEmailInput.fill('abc@gmai.com');
  }
}
