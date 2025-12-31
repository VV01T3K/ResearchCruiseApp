import type { Locator, Page } from '@playwright/test';
import { locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCCruiseInfoSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly cruiseDetailsButton: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-c-cruise-info-section');
    this.cruiseDetailsButton = this.sectionDiv.getByRole('button', { name: 'Pokaż szczegóły rejsu' });
  }

  public async defaultFill() {}
}
