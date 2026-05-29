import { expect, type Locator, type Page } from '@playwright/test';
import { API_URL, TESTED_FORM_ID } from '@tests/fixtures/consts';
import {
  getAdminAccountPayload,
  getAuthDetailsPayload,
  getFormAPayload,
  getInitValuesAPayload,
} from '@tests/fixtures/mockPayloads';
import { FormADto } from '@/api/dto/applications/FormADto';

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
  public readonly formId: string;
  public readonly sections;
  public readonly submitButton: Locator;
  private readonly toastMessage: Locator;
  public readonly submissionApprovedMessage: Locator;
  public readonly validationErrorMessage: Locator;

  public static async create(page: Page, formId: string = TESTED_FORM_ID): Promise<FormAPage> {
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

    page.route(`${API_URL}/api/CruiseApplications/${formId}/FormA?isDraft=false`, (route) => {
      route.fulfill({
        status: 200,
      });
    });

    // mock local storage
    await page.goto('/');

    await page.evaluate((authDetails) => {
      window.localStorage.setItem('authDetails', authDetails);
    }, JSON.stringify(getAuthDetailsPayload()));

    const formAPage = new FormAPage(page, formId);
    await formAPage.setFormAResponse(formAPage.buildFormAData());
    await formAPage.goto('edit');
    return formAPage;
  }

  public async goto(mode: 'edit' | 'view' | null = 'edit') {
    const modeParam = mode === null ? '' : `?mode=${mode}`;
    await this.page.goto(`/applications/${this.formId}/formA${modeParam}`);
  }

  private constructor(page: Page, formId: string) {
    this.page = page;
    this.formId = formId;
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
    const payload = this.buildFormAData(except ?? []);
    await this.setFormAResponse(payload);
    await this.goto('edit');
  }
  public async submitForm({
    expectedResult,
    message,
  }: { expectedResult?: 'valid' | 'invalid'; message?: string } = {}) {
    const initialUrl = this.page.url();
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
        await Promise.any([
          this.page.waitForURL((url) => url.toString() !== initialUrl, { timeout: 10000 }),
          this.submissionApprovedMessage.waitFor({ state: 'visible', timeout: 10000 }),
        ]);
        break;
      case 'invalid':
        {
          const outcome = await Promise.race([
            this.validationErrorMessage.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'error'),
            this.page.waitForURL((url) => url.toString() !== initialUrl, { timeout: 10000 }).then(() => 'navigated'),
          ]);

          if (outcome === 'navigated') {
            throw new Error('Form submitted successfully but expected invalid results.');
          }

          await expect(this.validationErrorMessage, { message: message }).toBeVisible();
        }
        await this.toastMessage.getByLabel('Close').first().click();
        break;
    }
  }

  private clonePayload<T>(payload: T): T {
    return JSON.parse(JSON.stringify(payload)) as T;
  }

  private buildFormAData(except: (keyof FormAPage['sections'])[] = []): FormADto {
    const payload = this.clonePayload(getFormAPayload()) as unknown as FormADto;
    const adminAccount = getAdminAccountPayload();
    const initValues = getInitValuesAPayload();
    const deputyCandidate = initValues.deputyManagers.find((manager) => manager.id !== adminAccount.id);

    payload.cruiseManagerId = adminAccount.id;
    payload.deputyManagerId = deputyCandidate?.id ?? initValues.deputyManagers[0]?.id ?? adminAccount.id;
    payload.precisePeriodStart ??= '';
    payload.precisePeriodEnd ??= '';

    if (except.includes('cruiseManagerInfoSection')) {
      payload.deputyManagerId = '';
    }

    if (except.includes('cruiseLengthSection')) {
      payload.acceptablePeriod = '';
      payload.optimalPeriod = '';
      payload.precisePeriodStart = '';
      payload.precisePeriodEnd = '';
      payload.periodNotes = '';
      payload.shipUsage = '';
      payload.differentUsage = '';
    }

    if (except.includes('permissionsSection')) {
      payload.permissions = [];
    }

    if (except.includes('researchAreaSection')) {
      payload.researchAreaDescriptions = [];
    }

    if (except.includes('cruiseGoalSection')) {
      payload.cruiseGoal = '';
      payload.cruiseGoalDescription = '';
    }

    if (except.includes('researchTasksSection')) {
      payload.researchTasks = [];
    }

    if (except.includes('contractsSection')) {
      payload.contracts = [];
    }

    if (except.includes('membersSection')) {
      payload.ugTeams = [];
      payload.guestTeams = [];
    }

    if (except.includes('publicationsSection')) {
      payload.publications = [];
    }

    if (except.includes('spubTasksSection')) {
      payload.spubTasks = [];
    }

    if (except.includes('supervisorInfoSection')) {
      payload.supervisorEmail = '';
    }

    return payload;
  }

  private async setFormAResponse(payload: FormADto) {
    const url = `${API_URL}/api/CruiseApplications/${this.formId}/formA`;

    await this.page.unroute(url).catch(() => undefined);
    await this.page.route(url, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(payload),
      });
    });
  }
}
