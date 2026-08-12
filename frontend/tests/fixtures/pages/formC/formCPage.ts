import { expect, type Locator, type Page } from '@playwright/test';
import { API_URL, TESTED_FORM_ID } from '@tests/fixtures/consts';
import {
  getAdminAccountPayload,
  getCruisePayload,
  getFormAPayload,
  getFormBPayload,
  getInitValuesAPayload,
  getInitValuesBPayload,
  mockAuthenticatedSession,
} from '@tests/fixtures/mockPayloads';

import { AdditionalDescriptionSection } from './AdditionalDescriptionSection';
import { AdditionalPermissionsSection } from './AdditionalPermissionsSection';
import { CollectedSamplesSection } from './CollectedSamplesSection';
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
import { SPUBReportDataSection } from './SPUBReportDataSection';
import { SPUBTasksSection } from './SPUBTasksSection';

export class FormCPage {
  public readonly page: Page;
  public readonly formId: string;
  public readonly sections;
  public readonly submitButton: Locator;
  private readonly toastMessage: Locator;
  public readonly submissionApprovedMessage: Locator;
  public readonly validationErrorMessage: Locator;

  public static async create(page: Page, formId: string = TESTED_FORM_ID): Promise<FormCPage> {
    await mockAuthenticatedSession(page);
    page.route(`${API_URL}/v2/applications/form-a/context`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getInitValuesAPayload()),
      });
    });

    page.route(`${API_URL}/v2/applications/form-b/context`, (route) => {
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

    page.route(`${API_URL}/v2/applications/${formId}/form-a`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getFormAPayload()),
      });
    });

    page.route(`${API_URL}/v2/applications/${formId}/form-b`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getFormBPayload()),
      });
    });

    page.route(`${API_URL}/v2/applications/${formId}/form-c`, (route) => {
      if (route.request().method() === 'PUT') {
        return route.fulfill({
          status: 200,
        });
      }

      // Form C is not yet created, so we mock a 404 response
      route.fulfill({
        status: 404,
      });
    });

    page.route(`${API_URL}/v2/users/me`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getAdminAccountPayload()),
      });
    });

    // return empty list of applications
    page.route(`${API_URL}/v2/applications`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

    const formCPage = new FormCPage(page, formId);
    await formCPage.goto();
    return formCPage;
  }

  public async goto(mode: 'edit' | 'view' | null = 'edit') {
    const modeParam = mode === null ? '' : `?mode=${mode}`;
    await this.page.goto(`/applications/${this.formId}/formC${modeParam}`);
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
      spubTasksSection: new SPUBTasksSection(this),
      cruiseDetailsSection: new CruiseDetailsSection(this),
      cruiseDayDetailsSection: new CruiseDayDetailsSection(this),
      researchEquipmentsSection: new ResearchEquipmentsSection(this),
      shipEquipmentsSection: new ShipEquipmentsSection(this),
      collectedSamplesSection: new CollectedSamplesSection(this),
      spubReportDataSection: new SPUBReportDataSection(this),
      additionalDescriptionSection: new AdditionalDescriptionSection(this),
    } as const;

    this.submitButton = this.page.getByRole('button', { name: 'Wyślij' });
    this.toastMessage = this.page.getByTestId('toast-container');
    this.submissionApprovedMessage = this.toastMessage.getByTestId('toast-success').first();
    this.validationErrorMessage = this.toastMessage.getByTestId('toast-error').first();
  }

  // Use after submit when the form is expected to be invalid (no navigation happens).
  // Waits for TanStack Form validation to complete and data-valid to become "false".
  public async getInvalidFormState(): Promise<Record<string, string[]>> {
    const el = this.page.locator('[data-testid="form-state"]');
    await expect(el).toHaveAttribute('data-valid', 'false', { timeout: 10000 });
    const errorsJson = await el.getAttribute('data-errors');
    return JSON.parse(errorsJson ?? '{}');
  }

  /**
   * Loads the form via the mocked API.
   * @param except sections cleared out entirely (empty arrays / empty strings)
   * @param withInvalidRows fills every list-based section with a row of invalid data,
   *                        so that row-level validation can be checked for all sections at once
   */
  public async fillForm({
    except,
    withInvalidRows,
  }: { except?: (keyof FormCPage['sections'])[]; withInvalidRows?: boolean } = {}) {
    const payload = this.buildFormCData(except ?? []);
    if (withInvalidRows) {
      this.applyInvalidRows(payload);
    }
    await this.setFormCResponse(payload);
    await this.goto('edit');
    await this.submitButton.waitFor({ state: 'visible' });
  }

  public async submitForm({ expectedResult }: { expectedResult?: 'valid' | 'invalid' } = {}) {
    const initialUrl = this.page.url();
    await this.submitButton.click();

    // Wait for any toast to appear and log its content for debugging
    const anyToast = this.toastMessage.locator('[data-testid^="toast-"]').first();
    try {
      await anyToast.waitFor({ state: 'visible', timeout: 5000 });
      const testId = await anyToast.getAttribute('data-testid');
      const toastType = testId?.replace('toast-', '');
      const toastText = await anyToast.textContent();
      console.log(`[FormC Toast] Type: ${toastType}, Text: ${toastText}`);
    } catch {
      console.log('[FormC Toast] No toast appeared within timeout');
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

          await expect(this.validationErrorMessage).toBeVisible();
        }
        await this.toastMessage.getByLabel('Close').first().click();
        break;
    }
  }

  private clonePayload<T>(payload: T): T {
    return JSON.parse(JSON.stringify(payload)) as T;
  }

  /**
   * Fills every list-based section with a single row of invalid data:
   * required text fields are left empty and numeric fields are given negative values.
   */
  private applyInvalidRows(payload: ReturnType<FormCPage['buildFormCData']>) {
    const ugUnitId = getFormBPayload().ugTeams[0].ugUnitId;

    payload.permissions = [{ description: '', executive: '' }] as typeof payload.permissions;
    payload.researchAreaDescriptions = [
      { areaId: null, differentName: null, info: '' },
    ] as unknown as typeof payload.researchAreaDescriptions;
    payload.ugTeams = [{ ugUnitId, noOfEmployees: '-1', noOfStudents: '-1' }];
    payload.guestTeams = [{ name: '', noOfPersons: '-1' }] as typeof payload.guestTeams;
    // The "unfinished task with conditions met" combination cannot be used here: the section
    // resets the condition flags during render, so blank the task's own required fields instead.
    payload.researchTasksEffects = payload.researchTasksEffects.map((task) => ({
      ...task,
      author: '',
      title: '',
    }));
    payload.contracts = [
      {
        category: 'international',
        institutionName: '',
        institutionUnit: '',
        institutionLocalization: '',
        description: '',
        scans: [],
      },
    ] as typeof payload.contracts;
    payload.spubTasks = [{ name: '', yearFrom: '', yearTo: '' }] as typeof payload.spubTasks;
    payload.shortResearchEquipments = [
      { name: '', startDate: '', endDate: '' },
    ] as typeof payload.shortResearchEquipments;
    payload.longResearchEquipments = [
      { name: '', action: 'Put', duration: '' },
    ] as typeof payload.longResearchEquipments;
    payload.ports = [{ name: '', startTime: '', endTime: '' }] as typeof payload.ports;
    payload.cruiseDaysDetails = [
      { number: '', hours: '', taskName: '', region: '', position: '', comment: '' },
    ] as typeof payload.cruiseDaysDetails;
    payload.researchEquipments = [
      { name: '', insuranceStartDate: null, insuranceEndDate: null, permission: 'true' },
    ] as typeof payload.researchEquipments;
    payload.collectedSamples = [
      { type: '', amount: '-1', analysis: '', publishing: '' },
    ] as typeof payload.collectedSamples;
  }

  private buildFormCData(except: (keyof FormCPage['sections'])[] = []) {
    const formA = this.clonePayload(getFormAPayload());
    const formB = this.clonePayload(getFormBPayload());
    const payload = {
      shipUsage: formA.shipUsage,
      differentUsage: formA.differentUsage,
      permissions: formB.permissions,
      researchAreaDescriptions: formA.researchAreaDescriptions,
      ugTeams: formB.ugTeams,
      guestTeams: formB.guestTeams,
      researchTasksEffects: formA.researchTasks.map((task) => ({
        ...task,
        done: 'false',
        managerConditionMet: 'false',
        deputyConditionMet: 'false',
      })),
      contracts: formA.contracts,
      spubTasks: formA.spubTasks,
      shortResearchEquipments: formB.shortResearchEquipments,
      longResearchEquipments: formB.longResearchEquipments,
      ports: formB.ports,
      cruiseDaysDetails: formB.cruiseDaysDetails,
      researchEquipments: formB.researchEquipments,
      shipEquipmentsIds: formB.shipEquipmentsIds,
      collectedSamples: [],
      spubReportData: '',
      additionalDescription: '',
      photos: [],
    };

    if (except.includes('additionalPermissionsSection')) {
      payload.permissions = [];
    }

    if (except.includes('contractsSection')) {
      payload.contracts = [];
    }

    if (except.includes('membersSection')) {
      payload.guestTeams = [];
    }

    if (except.includes('spubTasksSection')) {
      payload.spubTasks = [];
    }

    if (except.includes('cruiseDetailsSection')) {
      payload.shortResearchEquipments = [];
      payload.longResearchEquipments = [];
      payload.ports = [];
    }

    if (except.includes('cruiseDayDetailsSection')) {
      payload.cruiseDaysDetails = [];
    }

    if (except.includes('researchEquipmentsSection')) {
      payload.researchEquipments = [];
    }

    if (except.includes('collectedSamplesSection')) {
      payload.collectedSamples = [];
    }

    if (except.includes('spubReportDataSection')) {
      payload.spubReportData = '';
    }

    if (except.includes('additionalDescriptionSection')) {
      payload.additionalDescription = '';
      payload.photos = [];
    }

    return payload;
  }

  private async setFormCResponse(payload: ReturnType<FormCPage['buildFormCData']>) {
    const url = `${API_URL}/v2/applications/${this.formId}/form-c`;

    await this.page.unroute(url).catch(() => undefined);
    await this.page.route(url, (route) => {
      if (route.request().method() === 'PUT') {
        return route.fulfill({
          status: 200,
        });
      }

      route.fulfill({
        status: 200,
        body: JSON.stringify(payload),
      });
    });
  }
}
