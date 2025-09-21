import type { Locator, Page } from '@playwright/test';
import { FormDropdown, FormInput, locateSectionDiv } from '@tests/utils/form-filling-utils';

import { FormCPage } from './formCPage';

export class FormCSPUBTasksSection {
  public readonly formPage: FormCPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addNewTaskButton: Locator;
  public readonly addHistoricalTaskDropdown: FormDropdown;

  constructor(formPage: FormCPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionDiv(
      formPage.page,
      '11. Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie'
    );
    this.addNewTaskButton = this.sectionDiv.getByRole('button', { name: 'Dodaj' }).first();
    this.addHistoricalTaskDropdown = new FormDropdown(
      this.sectionDiv.getByRole('button', { name: 'Dodaj historyczne zadanie' })
    );
  }

  public taskRowLocator(index: 'first' | 'last' | number) {
    const rowsLocator = this.sectionDiv.locator('table').nth(0).getByRole('row');
    return index === 'first' ? rowsLocator.nth(2) : index === 'last' ? rowsLocator.last() : rowsLocator.nth(2 + index);
  }

  public taskRow(index: 'first' | 'last' | number) {
    const rowLocator = this.taskRowLocator(index);
    return {
      startYearDropdown: new FormDropdown(rowLocator.locator('td').nth(1).getByRole('button').first(), {
        variant: 'menu-with-buttons',
        errors: { required: rowLocator.getByText('Rok rozpoczęcia jest wymagany') },
      }),
      endYearDropdown: new FormDropdown(rowLocator.locator('td').nth(2).getByRole('button').first(), {
        variant: 'menu-with-buttons',
        errors: { required: rowLocator.getByText('Rok zakończenia jest wymagany') },
      }),
      nameInput: new FormInput(rowLocator.locator('td').nth(3).getByRole('textbox').first(), {
        errors: { required: rowLocator.getByText('Nazwa jest wymagana') },
      }),
      deleteButton: rowLocator.locator('td').nth(4).getByRole('button'),
    };
  }

  public async defaultFill() {}
}
