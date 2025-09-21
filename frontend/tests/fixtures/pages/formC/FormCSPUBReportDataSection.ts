import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCSPUBReportDataSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly reportInput: FormInput;
  public readonly sectionDiv: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '17. Dodatkowe dane do raportu SPUB');
    this.reportInput = new FormInput(this.sectionDiv.getByRole('textbox'), {
      errors: { tooLong: this.sectionDiv.getByText('Maksymalna długość to 10240 znaków') },
    });
  }

  public async defaultFill() {
    await this.reportInput.fill('Raport SPUB - dane testowe');
  }
}
