import type { Locator, Page } from '@playwright/test';
import { locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBCruiseInfoSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly cruiseDetailsButton: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '1. Informacje o rejsie');
    this.cruiseDetailsButton = this.sectionDiv.getByRole('button', { name: 'Pokaż szczegóły rejsu' });
  }

  public async defaultFill() {}
}
