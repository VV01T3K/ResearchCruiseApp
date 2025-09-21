import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCAdditionalDescriptionSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly descriptionInput: FormInput;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '18. Krótki opis podsumowujący dany rejs');
    this.descriptionInput = new FormInput(this.sectionDiv.getByRole('textbox'), {
      errors: { tooLong: this.sectionDiv.getByText('Maksymalna długość to 10240 znaków') },
    });
  }

  public async sendAttachment(filePath: string | readonly string[]) {
    const sendButton = this.sectionDiv.locator('div:below(:text("Załączniki"))').first();

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await sendButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  public async defaultFill() {
    await this.descriptionInput.fill('Krótki opis - dane testowe');
  }
}
