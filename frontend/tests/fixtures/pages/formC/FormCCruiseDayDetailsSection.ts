import type { Locator, Page } from '@playwright/test';
import { FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCCruiseDayDetailsSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addTaskButton: Locator;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(formPage.page, '13. Szczegółowy plan zadań zrealizowanych podczas rejsu');
    this.addTaskButton = this.sectionDiv.getByRole('button', { name: 'Dodaj' });
  }

  public taskRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public taskRow(index: 'first' | 'last' | number) {
    const rowLocator = this.taskRowLocator(index);
    return {
      dayInput: rowLocator.locator('td').nth(0).getByRole('textbox').first(),
      hoursInput: rowLocator.locator('td').nth(1).getByRole('textbox').first(),
      nameInput: new FormInput(rowLocator.locator('td').nth(2).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Nazwa zadania jest wymagana') },
      }),
      regionInput: new FormInput(rowLocator.locator('td').nth(3).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Region jest wymagany') },
      }),
      positionInput: new FormInput(rowLocator.locator('td').nth(4).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Pozycja jest wymagana') },
      }),
      commentInput: new FormInput(rowLocator.locator('td').nth(5).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Komentarz jest wymagany') },
      }),
    };
  }

  public async defaultFill() {}
}
