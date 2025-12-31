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
  public readonly emptyDoiMessage: Locator;
  public readonly emptyTitleMessage: Locator;
  public readonly emptyAuthorsMessage: Locator;
  public readonly emptyMagazineMessage: Locator;
  public readonly emptyYearMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-publications-section');
    this.addPublicationDropdown = new FormDropdown(this.sectionDiv.getByTestId('form-a-add-publication-btn'), {
      variant: 'menu-with-buttons',
    });
    this.addHistoricalPublicationDropdown = new FormDropdown(
      this.sectionDiv.getByTestId('form-a-add-historical-publication-btn')
    );
    this.errorsLocator = this.sectionDiv.getByTestId('form-a-publications-errors');
    this.emptyDoiMessage = this.sectionDiv.getByText('DOI jest wymagane');
    this.emptyTitleMessage = this.sectionDiv.getByText('Tytuł jest wymagany');
    this.emptyAuthorsMessage = this.sectionDiv.getByText('Autorzy są wymagani');
    this.emptyMagazineMessage = this.sectionDiv.getByText('Czasopismo jest wymagane');
    this.emptyYearMessage = this.sectionDiv.getByText('Rok jest wymagany');
  }

  public doiInput(index: 'first' | 'last' | number) {
    const table = this.sectionDiv.getByTestId('form-a-publications-table');
    const locator = table.getByTestId('form-a-publication-doi-input');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public titleInput(index: 'first' | 'last' | number) {
    const table = this.sectionDiv.getByTestId('form-a-publications-table');
    const locator = table.getByTestId('form-a-publication-title-input');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public authorsInput(index: 'first' | 'last' | number) {
    const table = this.sectionDiv.getByTestId('form-a-publications-table');
    const locator = table.getByTestId('form-a-publication-authors-input');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public magazineInput(index: 'first' | 'last' | number) {
    const table = this.sectionDiv.getByTestId('form-a-publications-table');
    const locator = table.getByTestId('form-a-publication-magazine-input');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public chooseYearDropdown(index: 'first' | 'last' | number) {
    const table = this.sectionDiv.getByTestId('form-a-publications-table');
    const allLocator = table.getByTestId('form-a-publication-year-button');
    const singleLocator =
      index === 'first' ? allLocator.first() : index === 'last' ? allLocator.last() : allLocator.nth(index);
    return new FormDropdown(singleLocator, { variant: 'menu-with-buttons' });
  }

  public pointsInput(index: 'first' | 'last' | number) {
    const table = this.sectionDiv.getByTestId('form-a-publications-table');
    const locator = table.getByTestId('form-a-publication-points-input');
    return index === 'first' ? locator.first() : index === 'last' ? locator.last() : locator.nth(index);
  }

  public async defaultFill() { } // Optional section
}
