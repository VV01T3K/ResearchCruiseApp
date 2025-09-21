import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormACruiseGoalSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly cruiseGoalDropdown: FormDropdown;
  public readonly cruiseGoalDescriptionInput: Locator;

  public readonly noCruiseGoalChosenMessage: Locator;
  public readonly noCruiseGoalDescriptionMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '5. Cel rejsu');
    this.cruiseGoalDropdown = new FormDropdown(
      this.sectionDiv.locator('button:below(label:text("Cel rejsu"))').first()
    );
    this.cruiseGoalDescriptionInput = this.sectionDiv.locator('input:below(:text("Opis"))').first();
    this.noCruiseGoalChosenMessage = this.sectionDiv.getByText('Cel rejsu musi być jednym z dostępnych celów rejsu');
    this.noCruiseGoalDescriptionMessage = this.sectionDiv.getByText('Opis celu rejsu jest wymagany');
  }

  public async defaultFill() {
    await this.cruiseGoalDropdown.selectOption('Naukowy');
    await this.cruiseGoalDescriptionInput.fill('Opis celu rejsu badawczego');
  }
}
