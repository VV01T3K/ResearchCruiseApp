import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormBPage } from './formBPage';

export class FormBCruiseDayDetailsSection {
  public readonly formPage: FormBPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addTaskButton: Locator;

  constructor(formPage: FormBPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-b-cruise-day-details-section');
    this.addTaskButton = this.sectionDiv.getByTestId('form-b-add-cruise-day-task-btn');
  }

  public taskRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public taskRow(index: 'first' | 'last' | number) {
    const rowLocator = this.taskRowLocator(index);
    return {
      dayInput: rowLocator.getByTestId('cruise-day-number-input'),
      hoursInput: rowLocator.getByTestId('cruise-day-hours-input'),
      nameInput: new FormInput(rowLocator.getByTestId('cruise-day-task-name-input'), {
        errors: { required: rowLocator.getByTestId('cruise-day-task-name-errors') },
      }),
      regionInput: new FormInput(rowLocator.getByTestId('cruise-day-region-input'), {
        errors: { required: rowLocator.getByTestId('cruise-day-region-errors') },
      }),
      positionInput: new FormInput(rowLocator.getByTestId('cruise-day-position-input'), {
        errors: { required: rowLocator.getByTestId('cruise-day-position-errors') },
      }),
      commentInput: new FormInput(rowLocator.getByTestId('cruise-day-comment-input'), {
        errors: { required: rowLocator.getByTestId('cruise-day-comment-errors') },
      }),
    };
  }

  public async defaultFill() {}
}
