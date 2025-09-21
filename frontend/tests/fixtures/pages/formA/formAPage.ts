import { expect, type Locator, type Page } from '@playwright/test';
import { API_URL } from '@tests/fixtures/consts';
import { getAdminAccountPayload, getAuthDetailsPayload, getInitValuesAPayload } from '@tests/fixtures/mockPayloads';

import { FormAContractsSection } from './FormAContractsSection';
import { FormACruiseGoalSection } from './FormACruiseGoalSection';
import { FormACruiseLengthSection } from './FormACruiseLengthSection';
import { FormACruiseManagerInfoSection } from './FormACruiseManagerInfoSection';
import { FormAMembersSection } from './FormAMembersSection';
import { FormAPermissionsSection } from './FormAPermissionsSection';
import { FormAPublicationsSection } from './FormAPublicationsSection';
import { FormAResearchAreaSection } from './FormAResearchAreaSection';
import { FormAResearchTasksSection } from './FormAResearchTasksSection';
import { FormASPUBTasksSection } from './FormASPUBTasksSection';
import { FormASupervisorInfoSection } from './FormASupervisorInfoSection';

export class FormAPage {
  public readonly page: Page;
  public readonly sections;
  public readonly submitButton: Locator;
  private readonly toastMessage: Locator;
  public readonly submissionApprovedMessage: Locator;
  public readonly validationErrorMessage: Locator;

  public static async create(page: Page): Promise<FormAPage> {
    page.route(`${API_URL}/forms/InitValues/A`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getInitValuesAPayload()),
      });
    });

    page.route(`${API_URL}/account`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getAdminAccountPayload()),
      });
    });

    page.route(`${API_URL}/api/Cruises/blockades/*`, (route) => {
      route.fulfill({
        status: 404,
      });
    });

    page.route(`${API_URL}/api/CruiseApplications?isDraft=false`, (route) => {
      // add payload verification if needed
      route.fulfill({
        status: 200,
      });
    });

    // mock local storage
    await page.goto('/');

    await page.evaluate((authDetails) => {
      window.localStorage.setItem('authDetails', authDetails);
    }, JSON.stringify(getAuthDetailsPayload()));

    const formAPage = new FormAPage(page);
    await formAPage.goto();
    return formAPage;
  }

  public async goto() {
    await this.page.goto('/newcruise');
  }

  private constructor(page: Page) {
    this.page = page;
    this.sections = {
      cruiseManagerInfoSection: new FormACruiseManagerInfoSection(this),
      cruiseLengthSection: new FormACruiseLengthSection(this),
      permissionsSection: new FormAPermissionsSection(this),
      researchAreaSection: new FormAResearchAreaSection(this),
      cruiseGoalSection: new FormACruiseGoalSection(this),
      researchTasksSection: new FormAResearchTasksSection(this),
      contractsSection: new FormAContractsSection(this),
      membersSection: new FormAMembersSection(this),
      publicationsSection: new FormAPublicationsSection(this),
      spubTasksSection: new FormASPUBTasksSection(this),
      supervisorInfoSection: new FormASupervisorInfoSection(this),
    } as const;

    this.submitButton = this.page.getByRole('button', { name: 'Wyślij' });
    this.toastMessage = this.page.locator('#_rht_toaster');
    this.submissionApprovedMessage = this.toastMessage.getByText(
      'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego.'
    );
    this.validationErrorMessage = this.toastMessage.getByText(
      'Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.'
    );
  }

  public async fillForm({ except }: { except?: (keyof FormAPage['sections'])[] } = {}) {
    except ??= [];
    const sections = Object.entries(this.sections);
    for (const [key, section] of sections) {
      if (except.includes(key as keyof FormAPage['sections'])) {
        continue;
      }
      await section.defaultFill();
    }
  }
  public async submitForm({
    expectedResult,
    message,
  }: { expectedResult?: 'valid' | 'invalid'; message?: string } = {}) {
    await this.submitButton.click();

    switch (expectedResult) {
      case 'valid':
        await expect(this.submissionApprovedMessage, { message: message }).toBeVisible();
        break;
      case 'invalid':
        await expect(this.validationErrorMessage, { message: message }).toBeVisible();
        await this.toastMessage.getByRole('button').click();
        break;
    }
  }
}
