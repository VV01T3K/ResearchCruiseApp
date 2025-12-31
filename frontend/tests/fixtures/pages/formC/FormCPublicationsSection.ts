import type { Locator, Page } from '@playwright/test';
import { locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCPublicationsSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-c-publications-section');
  }

  public async defaultFill() { }
}
