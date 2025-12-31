import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAPublicationsSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addPublicationDropdown: FormDropdown;
  public readonly addHistoricalPublicationDropdown: FormDropdown;

  public readonly errorsLocator: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-publications-section');
    this.addPublicationDropdown = new FormDropdown(
      this.page.getByTestId('form-a-add-publication-btn-button'),
      { variant: 'menu-with-buttons' }
    );
    this.addHistoricalPublicationDropdown = new FormDropdown(
      this.page.getByTestId('form-a-add-historical-publication-btn-button')
    );
    this.errorsLocator = this.page.getByTestId('form-a-publications-errors');
  }

  public doiInput(index: 'first' | 'last' | number) {
    const locator = this.sectionDiv.locator('input:below(:text("DOI"))');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public titleInput(index: 'first' | 'last' | number) {
    const locator = this.sectionDiv.locator('input:below(:text("Tytuł"))');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public authorsInput(index: 'first' | 'last' | number) {
    const locator = this.sectionDiv.locator('input:below(:text("Autorzy"))');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public magazineInput(index: 'first' | 'last' | number) {
    const locator = this.sectionDiv.locator('input:below(:text("Czasopismo"))');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public chooseYearDropdown(index: 'first' | 'last' | number) {
    const allLocator = this.sectionDiv.locator('button:below(:text("Rok"))');
    const singleLocator =
      index === 'first' ? allLocator.first() : index === 'last' ? allLocator.last() : allLocator.nth(index);
    return new FormDropdown(singleLocator, { variant: 'menu-with-buttons' });
  }

  public pointsInput(index: 'first' | 'last' | number) {
    const locator = this.sectionDiv.locator('input:below(:text("Punkty"))');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public async defaultFill() { } // Optional section
}
