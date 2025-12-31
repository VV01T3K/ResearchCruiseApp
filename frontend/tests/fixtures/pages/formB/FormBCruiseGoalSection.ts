import type { Locator, Page } from '@playwright/test';
import { locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBCruiseGoalSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-cruise-goal-section');
  }

  public async defaultFill() { }
}
