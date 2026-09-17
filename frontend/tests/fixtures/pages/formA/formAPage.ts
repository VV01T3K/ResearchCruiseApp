import { type Locator, type Page } from '@playwright/test';
import { API_URL, TESTED_FORM_ID } from '@tests/fixtures/consts';
import { clonePayload, getInvalidFormState, submitForm } from '@tests/fixtures/pages/formPageUtils';
import {
  getAdminAccountPayload,
  getFormAPayload,
  getInitValuesAPayload,
  mockAuthenticatedSession,
} from '@tests/fixtures/mockPayloads';
import type { FormAFields } from '@/api/generated/schemas/applications/formAFields.gen';

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
    await mockAuthenticatedSession(page);
    page.route(`${API_URL}/v2/applications/form-a/context`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getInitValuesAPayload()),
      });
    });

    page.route(`${API_URL}/v2/users/me`, (route) => {
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

  // Use after submit when the form is expected to be invalid (no navigation happens).
  // Waits for TanStack Form validation to complete and data-valid to become "false".
  public async getInvalidFormState(): Promise<Record<string, string[]>> {
    return getInvalidFormState(this.page);
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
  }: { except?: (keyof FormAPage['sections'])[]; withInvalidRows?: boolean } = {}) {
    const payload = this.buildFormAData(except ?? []);
    if (withInvalidRows) {
      this.applyInvalidRows(payload);
    }
    await this.setFormAResponse(payload);
    await this.goto('edit');
  }
  public async submitForm({
    expectedResult,
    message,
  }: { expectedResult?: 'valid' | 'invalid'; message?: string } = {}) {
    await submitForm({
      page: this.page,
      submitButton: this.submitButton,
      toastMessage: this.toastMessage,
      submissionApprovedMessage: this.submissionApprovedMessage,
      validationErrorMessage: this.validationErrorMessage,
      expectedResult,
      message,
    });
  }

  /**
   * Fills every list-based section with a single row of invalid data:
   * required text fields are left empty and numeric fields are given negative values.
   */
  private applyInvalidRows(payload: FormAFields) {
    const ugUnitId = getFormAPayload().ugTeams[0].ugUnitId;

    payload.permissions = [{ description: '', executive: '' }];
    payload.researchAreaDescriptions = [{ areaId: null, differentName: null, info: '' }];
    payload.researchTasks = [{ type: '0', author: '', title: '' }] as FormAFields['researchTasks'];
    payload.contracts = [
      {
        category: 'international',
        institutionName: '',
        institutionUnit: '',
        institutionLocalization: '',
        description: '',
        scans: [],
      },
    ];
    payload.ugTeams = [{ ugUnitId, noOfEmployees: '-1', noOfStudents: '-1' }];
    payload.guestTeams = [{ name: '', noOfPersons: '-1' }];
    payload.publications = [
      {
        id: '',
        category: 'subject',
        doi: '',
        authors: '',
        title: '',
        magazine: '',
        year: '',
        ministerialPoints: '-1',
      },
    ] as FormAFields['publications'];
    payload.spubTasks = [{ name: '', yearFrom: '', yearTo: '' }];
  }

  private buildFormAData(except: (keyof FormAPage['sections'])[] = []): FormAFields {
    const payload = clonePayload(getFormAPayload()) as unknown as FormAFields;
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
      payload.acceptablePeriod = [];
      payload.optimalPeriod = [];
      payload.precisePeriodStart = '';
      payload.precisePeriodEnd = '';
      payload.periodNotes = '';
      payload.shipUsage = '';
      payload.differentUsage = '';
      payload.cruiseHours = '0';
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

  /**
   * Makes the save fail. An existing application is edited, so the form submits
   * `PUT /v2/applications/{id}/form-a` — not the `POST /v2/applications` create route.
   *
   * Registered after `setFormAResponse`, so it takes precedence for the PUT and falls back
   * to the GET handler that serves the form payload.
   */
  public async failSaveWith(status: number, body: unknown) {
    await this.page.route(`${API_URL}/v2/applications/${this.formId}/form-a`, (route) => {
      if (route.request().method() !== 'PUT') {
        return route.fallback();
      }
      route.fulfill({
        status,
        contentType: 'application/problem+json',
        body: JSON.stringify(body),
      });
    });
  }

  private async setFormAResponse(payload: FormAFields) {
    const url = `${API_URL}/v2/applications/${this.formId}/form-a`;

    await this.page.unroute(url).catch(() => undefined);
    await this.page.route(url, (route) => {
      if (route.request().method() === 'PUT') {
        return route.fulfill({ status: 200 });
      }

      route.fulfill({
        status: 200,
        body: JSON.stringify(payload),
      });
    });
  }
}
