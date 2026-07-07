import { expect, type Locator, type Page } from '@playwright/test';
import { API_URL } from '@tests/fixtures/consts';
import { getAdminAccountPayload, getAuthDetailsPayload, getInitValuesAPayload } from '@tests/fixtures/mockPayloads';

import { ContractsSection } from './ContractsSection';
import { CruiseGoalSection } from './CruiseGoalSection';
import { CruiseLengthSection } from './CruiseLengthSection';
import { CruiseManagerInfoSection } from './CruiseManagerInfoSection';
import { MembersSection } from './MembersSection';
import { PermissionsSection } from './PermissionsSection';
import { PublicationsSection } from './PublicationsSection';
import { ResearchAreaSection } from './ResearchAreaSection';
import { ResearchTasksSection } from './ResearchTasksSection';
import { SPUBTasksSection } from './SPUBTasksSection';
import { SupervisorInfoSection } from './SupervisorInfoSection';

export class FormAPage {
  public readonly page: Page;
  public readonly sections;
  public readonly submitButton: Locator;
  private readonly toastMessage: Locator;
  public readonly submissionApprovedMessage: Locator;
  public readonly validationErrorMessage: Locator;

  public static async create(page: Page): Promise<FormAPage> {
    page.route(`${API_URL}/v2/applications/form-a/context`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getInitValuesAPayload()),
      });
    });

    page.route(`${API_URL}/v2/account/me`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getAdminAccountPayload()),
      });
    });

    page.route(`${API_URL}/v2/cruises/blockades?*`, (route) => {
      route.fulfill({
        status: 404,
      });
    });

    page.route(`${API_URL}/v2/applications`, (route) => {
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
    await this.page.goto('/applications/new');
  }

  private constructor(page: Page) {
    this.page = page;
    this.sections = {
      cruiseManagerInfoSection: new CruiseManagerInfoSection(this),
      cruiseLengthSection: new CruiseLengthSection(this),
      permissionsSection: new PermissionsSection(this),
      researchAreaSection: new ResearchAreaSection(this),
      cruiseGoalSection: new CruiseGoalSection(this),
      researchTasksSection: new ResearchTasksSection(this),
      contractsSection: new ContractsSection(this),
      membersSection: new MembersSection(this),
      publicationsSection: new PublicationsSection(this),
      spubTasksSection: new SPUBTasksSection(this),
      supervisorInfoSection: new SupervisorInfoSection(this),
    } as const;

    this.submitButton = this.page.getByTestId('form-submit-btn');
    this.toastMessage = this.page.getByTestId('toast-container');
    this.submissionApprovedMessage = this.toastMessage.getByTestId('toast-success').first();
    this.validationErrorMessage = this.toastMessage.getByTestId('toast-error').first();
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

    // Wait for any toast to appear and log its content for debugging
    const anyToast = this.toastMessage.locator('[data-testid^="toast-"]').first();
    try {
      await anyToast.waitFor({ state: 'visible', timeout: 5000 });
      const testId = await anyToast.getAttribute('data-testid');
      const toastType = testId?.replace('toast-', '');
      const toastText = await anyToast.textContent();
      console.log(`[FormA Toast] Type: ${toastType}, Text: ${toastText}`);
    } catch {
      console.log('[FormA Toast] No toast appeared within timeout');
    }

    switch (expectedResult) {
      case 'valid':
        await expect(this.submissionApprovedMessage, { message: message }).toBeVisible();
        break;
      case 'invalid':
        await expect(this.validationErrorMessage, { message: message }).toBeVisible();
        await this.toastMessage.getByLabel('Close').first().click();
        break;
    }
  }
}
