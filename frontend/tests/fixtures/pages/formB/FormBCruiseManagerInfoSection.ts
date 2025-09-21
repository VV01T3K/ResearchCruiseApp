import type { Locator, Page } from '@playwright/test';
import { locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBCruiseManagerInfoSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly isManagerPresentCheckbox: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '2. Kierownik zgłaszanego rejsu');
    this.isManagerPresentCheckbox = this.sectionDiv.getByRole('checkbox', {
      name: 'Czy kierownik jest obecny na rejsie?',
    });
  }

  public async defaultFill() {}
}
