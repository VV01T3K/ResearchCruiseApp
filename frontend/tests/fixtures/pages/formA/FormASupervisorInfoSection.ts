import type { Locator, Page } from '@playwright/test';
import { locateSectionByTestId } from '@tests/utils/form-filling-utils';

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
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-supervisor-section');
    this.supervisorEmailInput = this.page.getByTestId('form-a-supervisor-email-input');
    this.missingEmailMessage = this.page.getByTestId('form-a-supervisor-email-errors');
    this.invalidEmailMessage = this.page.getByTestId('form-a-supervisor-email-errors');
  }

  public async defaultFill() {
    await this.supervisorEmailInput.fill('abc@gmai.com');
  }
}
