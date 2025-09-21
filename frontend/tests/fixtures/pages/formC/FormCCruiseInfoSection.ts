import type { Locator, Page } from '@playwright/test';
import { locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCCruiseInfoSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly cruiseDetailsButton: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '1. Informacje o rejsie');
    this.cruiseDetailsButton = this.sectionDiv.getByRole('button', { name: 'Pokaż szczegóły rejsu' });
  }

  public async defaultFill() {}
}
