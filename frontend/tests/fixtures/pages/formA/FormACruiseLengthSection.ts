import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormACruiseLengthSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly cruiseDaysInput: Locator;
  public readonly cruiseDaysDecreaseButton: Locator;
  public readonly cruiseDaysIncreaseButton: Locator;
  public readonly cruiseHoursInput: Locator;
  public readonly cruiseHoursDecreaseButton: Locator;
  public readonly cruiseHoursIncreaseButton: Locator;
  public readonly periodNotesInput: Locator;
  public readonly shipUsageDropdown: FormDropdown;
  public readonly alternativeShipUsageInput: Locator;
  public readonly periodSelectionTypeDropdown: FormDropdown;

  public readonly invalidCruiseDurationMessage: Locator;
  public readonly emptyAlternativeShipUsageMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-cruise-length-section');

    // Cruise days input using data-testid
    const cruiseDaysContainer = this.page.getByTestId('form-a-cruise-days');
    this.cruiseDaysInput = cruiseDaysContainer.getByTestId('form-a-cruise-days-input');
    this.cruiseDaysDecreaseButton = cruiseDaysContainer.getByRole('button').nth(0);
    this.cruiseDaysIncreaseButton = cruiseDaysContainer.getByRole('button').nth(1);

    // Cruise hours input using data-testid
    const cruiseHoursContainer = this.page.getByTestId('form-a-cruise-hours');
    this.cruiseHoursInput = cruiseHoursContainer.getByTestId('form-a-cruise-hours-input');
    this.cruiseHoursDecreaseButton = cruiseHoursContainer.getByRole('button').nth(0);
    this.cruiseHoursIncreaseButton = cruiseHoursContainer.getByRole('button').nth(1);

    this.periodNotesInput = this.page.getByTestId('form-a-period-notes-input');
    this.shipUsageDropdown = new FormDropdown(
      this.sectionDiv.locator('button:below(:text("Statek na potrzeby badań będzie wykorzystywany"))').first()
    );
    this.alternativeShipUsageInput = this.sectionDiv.locator('input:below(:text("Inny sposób użycia"))').first();
    this.periodSelectionTypeDropdown = new FormDropdown(this.page.getByTestId('form-a-period-selection-type-button'));
    this.invalidCruiseDurationMessage = this.page.getByTestId('form-a-cruise-hours-errors');
    this.emptyAlternativeShipUsageMessage = this.sectionDiv.getByText(
      'w przypadku wyboru "inne" należy podać informacje o sposobie korzystania z statku'
    );
  }

  public async defaultFill() {
    await this.cruiseDaysInput.fill('5');
    await this.cruiseDaysIncreaseButton.click();
    await this.periodNotesInput.fill('Rejs planowany na okres letni.');
    await this.shipUsageDropdown.selectOption('całą dobę');

    await this.periodSelectionTypeDropdown.selectOption('Okres dopuszczalny/optymalny');

    const firstSlider = this.sectionDiv.getByRole('slider').first();
    await firstSlider.waitFor({ state: 'visible' });
    await firstSlider.click();
  }
}
