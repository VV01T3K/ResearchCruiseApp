import { expect, type Locator, type Page } from '@playwright/test';
import { API_URL, TESTED_FORM_ID } from '@tests/fixtures/consts';
import {
  getAdminAccountPayload,
  getAuthDetailsPayload,
  getCruisePayload,
  getFormAPayload,
  getInitValuesAPayload,
  getInitValuesBPayload,
} from '@tests/fixtures/mockPayloads';

import { AdditionalPermissionsSection } from './AdditionalPermissionsSection';
import { ContractsSection } from './ContractsSection';
import { CruiseDayDetailsSection } from './CruiseDayDetailsSection';
import { CruiseDetailsSection } from './CruiseDetailsSection';
import { CruiseGoalSection } from './CruiseGoalSection';
import { CruiseInfoSection } from './CruiseInfoSection';
import { CruiseManagerInfoSection } from './CruiseManagerInfoSection';
import { MembersSection } from './MembersSection';
import { PublicationsSection } from './PublicationsSection';
import { ResearchAreaSection } from './ResearchAreaSection';
import { ResearchEquipmentsSection } from './ResearchEquipmentsSection';
import { ResearchTasksSection } from './ResearchTasksSection';
import { ShipEquipmentsSection } from './ShipEquipmentsSection';
import { ShipUsageSection } from './ShipUsageSection';
import { SPUBTasksSection } from './SPUBTasksSection';

export class FormBPage {
  public readonly page: Page;
  public readonly formId: string;
  public readonly sections;
  public readonly submitButton: Locator;
  private readonly toastMessage: Locator;
  public readonly submissionApprovedMessage: Locator;
  public readonly validationErrorMessage: Locator;

  public static async create(page: Page, formId: string = TESTED_FORM_ID): Promise<FormBPage> {
    page.route(`${API_URL}/forms/InitValues/A`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getInitValuesAPayload()),
      });
    });

    page.route(`${API_URL}/forms/InitValues/B`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getInitValuesBPayload()),
      });
    });

    page.route(`${API_URL}/v2/applications/${formId}/cruise`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getCruisePayload()),
      });
    });

    page.route(`${API_URL}/api/CruiseApplications/${formId}/formA`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getFormAPayload()),
      });
    });

    // Form B is not yet created, so we mock a 404 response
    page.route(`${API_URL}/api/CruiseApplications/${formId}/formB`, (route) => {
      route.fulfill({
        status: 404,
      });
    });

    page.route(`${API_URL}/v2/account/me`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getAdminAccountPayload()),
      });
    });

    page.route(`${API_URL}/api/CruiseApplications/${formId}/FormB?isDraft=false`, (route) => {
      route.fulfill({
        status: 200,
      });
    });

    // return empty list of applications
    page.route(`${API_URL}/v2/applications`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

    // mock local storage
    await page.goto('/');

    await page.evaluate((authDetails) => {
      window.localStorage.setItem('authDetails', authDetails);
    }, JSON.stringify(getAuthDetailsPayload()));

    const formBPage = new FormBPage(page, formId);
    await formBPage.goto();
    return formBPage;
  }

  public async goto(mode: 'edit' | 'view' | null = 'edit') {
    const modeParam = mode === null ? '' : `?mode=${mode}`;
    await this.page.goto(`/applications/${this.formId}/formB${modeParam}`);
  }

  private constructor(page: Page, formId: string) {
    this.page = page;
    this.formId = formId;
    this.sections = {
      cruiseInfoSection: new CruiseInfoSection(this),
      cruiseManagerInfoSection: new CruiseManagerInfoSection(this),
      shipUsageSection: new ShipUsageSection(this),
      additionalPermissionsSection: new AdditionalPermissionsSection(this),
      researchAreaSection: new ResearchAreaSection(this),
      cruiseGoalSection: new CruiseGoalSection(this),
      researchTasksSection: new ResearchTasksSection(this),
      contractsSection: new ContractsSection(this),
      membersSection: new MembersSection(this),
      publicationsSection: new PublicationsSection(this),
      SPUBTasksSection: new SPUBTasksSection(this),
      cruiseDetailsSection: new CruiseDetailsSection(this),
      cruiseDayDetailsSection: new CruiseDayDetailsSection(this),
      researchEquipmentsSection: new ResearchEquipmentsSection(this),
      shipEquipmentSection: new ShipEquipmentsSection(this),
    } as const;

    this.submitButton = this.page.getByRole('button', { name: 'Wyślij' });
    this.toastMessage = this.page.getByTestId('toast-container');
    this.submissionApprovedMessage = this.toastMessage.getByTestId('toast-success').first();
    this.validationErrorMessage = this.toastMessage.getByTestId('toast-error').first();
  }

  public async fillForm({ except }: { except?: (keyof FormBPage['sections'])[] } = {}) {
    except ??= [];
    const sections = Object.entries(this.sections);
    for (const [key, section] of sections) {
      if (except.includes(key as keyof FormBPage['sections'])) {
        continue;
      }
      await section.defaultFill();
    }
  }

  public async submitForm({ expectedResult }: { expectedResult?: 'valid' | 'invalid' } = {}) {
    await this.submitButton.click();

    // Wait for any toast to appear and log its content for debugging
    const anyToast = this.toastMessage.locator('[data-testid^="toast-"]').first();
    try {
      await anyToast.waitFor({ state: 'visible', timeout: 5000 });
      const testId = await anyToast.getAttribute('data-testid');
      const toastType = testId?.replace('toast-', '');
      const toastText = await anyToast.textContent();
      console.log(`[FormB Toast] Type: ${toastType}, Text: ${toastText}`);
    } catch {
      console.log('[FormB Toast] No toast appeared within timeout');
    }

    switch (expectedResult) {
      case 'valid':
        await expect(this.submissionApprovedMessage).toBeVisible();
        break;
      case 'invalid':
        await expect(this.validationErrorMessage).toBeVisible();
        await this.toastMessage.getByLabel('Close').first().click();
        break;
    }
  }
}
