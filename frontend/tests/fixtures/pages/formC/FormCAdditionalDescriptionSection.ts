import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCAdditionalDescriptionSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly descriptionInput: FormInput;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-c-additional-description-section');
    this.descriptionInput = new FormInput(this.sectionDiv.getByTestId('form-c-description-input'), {
      errors: { tooLong: this.sectionDiv.getByText('Maksymalna długość to 10240 znaków') },
    });
  }

  public async sendAttachment(filePath: string | readonly string[]) {
    const sendButton = this.sectionDiv.getByTestId('form-c-attachment-input-button');

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await sendButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  public async defaultFill() {
    await this.descriptionInput.fill('Krótki opis - dane testowe');
  }
}
