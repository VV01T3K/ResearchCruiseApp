import type { Locator, Page } from '@playwright/test';
import { locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBCruiseManagerInfoSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly isManagerPresentCheckbox: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-cruise-manager-section');
    this.isManagerPresentCheckbox = this.sectionDiv.getByTestId('form-b-manager-present-checkbox');
  }

  public async defaultFill() {}
}
