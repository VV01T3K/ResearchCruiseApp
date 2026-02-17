import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

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
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-c-spub-tasks-section');
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
      nameDropdown: new FormDropdown(rowLocator.locator('td').nth(3).getByRole('combobox').first(), {
        errors: { required: rowLocator.getByText('Nazwa jest wymagana') },
      }),
      deleteButton: rowLocator.locator('td').nth(4).getByRole('button'),
    };
  }

  public async defaultFill() {}
}
