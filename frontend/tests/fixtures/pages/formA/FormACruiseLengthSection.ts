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
    const cruiseDaysContainer = this.sectionDiv.getByTestId('form-a-cruise-days');
    this.cruiseDaysInput = cruiseDaysContainer.getByTestId('form-a-cruise-days-input');
    this.cruiseDaysDecreaseButton = cruiseDaysContainer.getByRole('button', { name: 'Decrease' });
    this.cruiseDaysIncreaseButton = cruiseDaysContainer.getByRole('button', { name: 'Increase' });

    // Cruise hours input using data-testid
    const cruiseHoursContainer = this.sectionDiv.getByTestId('form-a-cruise-hours');
    this.cruiseHoursInput = cruiseHoursContainer.getByTestId('form-a-cruise-hours-input');
    this.cruiseHoursDecreaseButton = cruiseHoursContainer.getByRole('button', { name: 'Decrease' });
    this.cruiseHoursIncreaseButton = cruiseHoursContainer.getByRole('button', { name: 'Increase' });

    this.periodNotesInput = this.sectionDiv.getByTestId('form-a-period-notes-input');
    this.shipUsageDropdown = new FormDropdown(this.sectionDiv.getByTestId('form-a-ship-usage-button'));
    this.alternativeShipUsageInput = this.sectionDiv.getByTestId('form-a-alternative-ship-usage-input');
    this.periodSelectionTypeDropdown = new FormDropdown(
      this.sectionDiv.getByTestId('form-a-period-selection-type-button')
    );
    this.invalidCruiseDurationMessage = this.sectionDiv.getByTestId('form-a-cruise-hours-errors');
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

    // When "Okres dopuszczalny/optymalny" is selected, there are TWO period inputs:
    // 1. Acceptable period (dopuszczalny okres)
    // 2. Optimal period (optymalny okres)
    // Each period input has 2 sliders (start and end months)
    
    // Get all sliders - should have 4 total (2 for acceptable, 2 for optimal)
    const allSliders = this.sectionDiv.getByRole('slider');
    await allSliders.first().waitFor({ state: 'visible' });
    
    // Set acceptable period (first 2 sliders): January to June
    await allSliders.nth(0).focus();
    for (let i = 0; i < 2; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
    
    await allSliders.nth(1).focus();
    for (let i = 0; i < 12; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
    
    // Set optimal period (last 2 sliders): March to May
    await allSliders.nth(2).focus();
    for (let i = 0; i < 4; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
    
    await allSliders.nth(3).focus();
    for (let i = 0; i < 10; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
  }
}
