import type { Locator, Page } from '@playwright/test';
import { locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBCruiseInfoSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly cruiseDetailsButton: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-cruise-info-section');
    this.cruiseDetailsButton = this.sectionDiv.getByRole('button', { name: 'Pokaż szczegóły rejsu' });
  }

  public async defaultFill() {}
}
