import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

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
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-cruise-goal-section');
    this.cruiseGoalDropdown = new FormDropdown(this.sectionDiv.getByTestId('form-a-cruise-goal-button'));
    this.cruiseGoalDescriptionInput = this.sectionDiv.getByTestId('form-a-cruise-goal-description-input');
    this.noCruiseGoalChosenMessage = this.sectionDiv.getByTestId('form-a-cruise-goal-errors');
    this.noCruiseGoalDescriptionMessage = this.sectionDiv.getByTestId('form-a-cruise-goal-description-errors');
  }

  public async defaultFill() {
    await this.cruiseGoalDropdown.selectOption('Naukowy');
    await this.cruiseGoalDescriptionInput.fill('Opis celu rejsu badawczego');
  }
}
