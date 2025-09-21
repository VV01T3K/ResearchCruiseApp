import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAPublicationsSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addPublicationDropdown: FormDropdown;
  public readonly addHistoricalPublicationDropdown: FormDropdown;

  public readonly emptyDoiMessage: Locator;
  public readonly emptyTitleMessage: Locator;
  public readonly emptyAuthorsMessage: Locator;
  public readonly emptyMagazineMessage: Locator;
  public readonly emptyYearMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '9. Publikacje');
    this.addPublicationDropdown = new FormDropdown(
      this.sectionDiv.getByRole('button', { name: 'Dodaj nową publikację' }),
      { variant: 'menu-with-buttons' }
    );
    this.addHistoricalPublicationDropdown = new FormDropdown(
      this.sectionDiv.getByRole('button', { name: 'Dodaj historyczną publikację' })
    );
    this.emptyDoiMessage = this.sectionDiv.getByText('DOI jest wymagane');
    this.emptyTitleMessage = this.sectionDiv.getByText('Tytuł jest wymagany');
    this.emptyAuthorsMessage = this.sectionDiv.getByText('Autorzy są wymagani');
    this.emptyMagazineMessage = this.sectionDiv.getByText('Czasopismo jest wymagane');
    this.emptyYearMessage = this.sectionDiv.getByText('Rok jest wymagany');
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

  public async defaultFill() {} // Optional section
}
