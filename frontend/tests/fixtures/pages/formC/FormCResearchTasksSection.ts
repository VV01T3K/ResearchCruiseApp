import type { Locator, Page } from '@playwright/test';
import { locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCResearchTasksSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-c-research-tasks-effects-section');
  }

  public taskRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(1) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(1 + index);
  }

  public taskRow(index: 'first' | 'last' | number) {
    const rowLocator = this.taskRowLocator(index);
    const cellLocator = rowLocator.locator('td').nth(3);

    const checkboxes = cellLocator.getByRole('checkbox');

    return {
      doneCheckbox: checkboxes.nth(0),
      managerConditionMetCheckbox: checkboxes.nth(1),
      deputyConditionMetCheckbox: checkboxes.nth(2),
    };
  }

  public async defaultFill() {}
}
