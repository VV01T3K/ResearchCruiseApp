import type { Locator, Page } from '@playwright/test';
import { locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCResearchTasksSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '7. Zadania przypisane do rejsu - efekty rejsu');
  }

  public taskRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(1) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(1 + index);
  }

  public taskRow(index: 'first' | 'last' | number) {
    const rowLocator = this.taskRowLocator(index);
    return {
      doneCheckbox: rowLocator.locator('td').nth(3).getByText('Zrealizowane'),
      managerConditionMetCheckbox: rowLocator.locator('td').nth(3).getByText('Czy naliczyć punkty kierownikowi?'),
      deputyConditionMetCheckbox: rowLocator.locator('td').nth(3).getByText('Czy naliczyć punkty zastępcy?'),
    };
  }

  public async defaultFill() {}
}
