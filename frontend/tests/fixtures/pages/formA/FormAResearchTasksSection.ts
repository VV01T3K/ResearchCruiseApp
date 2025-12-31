import type { Locator, Page } from '@playwright/test';
import { FormDropdown, locateSectionByTestId } from '@tests/utils/form-filling-utils';

import { FormAPage } from './formAPage';

export class FormAResearchTasksSection {
  public readonly formPage: FormAPage;
  public readonly page: Page;
  public readonly sectionDiv: Locator;
  public readonly addNewTaskDropdown: FormDropdown;
  public readonly addHistoricalTaskDropdown: FormDropdown;

  public readonly noResearchTasksMessage: Locator;
  public readonly emptyAuthorMessage: Locator;
  public readonly emptyTitleMessage: Locator;

  constructor(formPage: FormAPage) {
    this.formPage = formPage;
    this.page = formPage.page;
    this.sectionDiv = locateSectionByTestId(formPage.page, 'form-a-research-tasks-section');

    this.addNewTaskDropdown = new FormDropdown(
      this.page.getByTestId('form-a-add-research-task-btn'),
      {
        variant: 'menu-with-buttons',
      }
    );
    this.addHistoricalTaskDropdown = new FormDropdown(
      this.page.getByTestId('form-a-add-historical-research-task-btn')
    );
    this.noResearchTasksMessage = this.page.getByTestId('form-a-research-tasks-errors');
    this.emptyAuthorMessage = this.sectionDiv.getByText('Autor nie może być pusty');
    this.emptyTitleMessage = this.sectionDiv.getByText('Tytuł nie może być pusty');
  }

  // TODO: There are many types of inputs in this section, this requires more
  // complex handling, if one wanted to extensively check all the options.
  public authorInput(index: 'first' | 'last' | number) {
    const actualIndex = index === 'first' ? 0 : index === 'last' ? -1 : index;
    if (actualIndex === -1) {
      // For 'last', we need to find all matching inputs and get the last one
      return this.sectionDiv.locator('input[name^="researchTasks["][name$="].author"]').last();
    }
    return this.sectionDiv.locator(`input[name="researchTasks[${actualIndex}].author"]`);
  }

  public titleInput(index: 'first' | 'last' | number) {
    const actualIndex = index === 'first' ? 0 : index === 'last' ? -1 : index;
    if (actualIndex === -1) {
      // For 'last', we need to find all matching inputs and get the last one
      return this.sectionDiv.locator('input[name^="researchTasks["][name$="].title"]').last();
    }
    return this.sectionDiv.locator(`input[name="researchTasks[${actualIndex}].title"]`);
  }

  public async defaultFill() {
    await this.addNewTaskDropdown.selectOption('Praca licencjacka');
    await this.authorInput('first').fill('Jan Kowalski');
    await this.titleInput('first').fill('Zadanie badawcze na morzu');
  }
}
