import { type Locator, type Page } from '@playwright/test';
import { API_URL, TESTED_FORM_ID } from '@tests/fixtures/consts';
import { clonePayload, getInvalidFormState, submitForm } from '@tests/fixtures/pages/formPageUtils';
import {
  getAdminAccountPayload,
  getCruisePayload,
  getFormAPayload,
  getFormBPayload,
  getInitValuesAPayload,
  getInitValuesBPayload,
  mockAuthenticatedSession,
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
      if (route.request().method() === 'PUT') {
        return route.fulfill({
          status: 200,
        });
      }

      // Form B is not yet created, so we mock a 404 response
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
    page.route(`${API_URL}/v2/applications?*`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ items: [], nextCursor: null }),
      });
    });
    page.route(`${API_URL}/v2/applications/managers`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

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

  // Use after submit when the form is expected to be invalid (no navigation happens).
  // Waits for TanStack Form validation to complete and data-valid to become "false".
  public async getInvalidFormState(): Promise<Record<string, string[]>> {
    return getInvalidFormState(this.page);
  }

  /**
   * Loads the form via the mocked API.
   * @param except sections cleared out entirely (empty arrays)
   * @param withInvalidRows fills every list-based section with a row of invalid data,
   *                        so that row-level validation can be checked for all sections at once
   */
  public async fillForm({
    except,
    withInvalidRows,
  }: { except?: (keyof FormBPage['sections'])[]; withInvalidRows?: boolean } = {}) {
    const payload = this.buildFormBData(except ?? []);
    if (withInvalidRows) {
      this.applyInvalidRows(payload);
    }
    await this.setFormBResponse(payload);
    await this.goto('edit');
    await this.submitButton.waitFor({ state: 'visible' });
  }

  public async submitForm({ expectedResult }: { expectedResult?: 'valid' | 'invalid' } = {}) {
    await submitForm({
      page: this.page,
      submitButton: this.submitButton,
      toastMessage: this.toastMessage,
      submissionApprovedMessage: this.submissionApprovedMessage,
      validationErrorMessage: this.validationErrorMessage,
      expectedResult,
    });
  }

  /**
   * Fills every list-based section with a single row of invalid data:
   * required text fields are left empty and numeric fields are given negative values.
   */
  private applyInvalidRows(payload: ReturnType<typeof getFormBPayload>) {
    const ugUnitId = getFormBPayload().ugTeams[0].ugUnitId;

    // permissions require a PDF scan, so an empty row fails on every field
    payload.permissions = [{ description: '', executive: '' }] as typeof payload.permissions;
    payload.ugTeams = [{ ugUnitId, noOfEmployees: '-1', noOfStudents: '-1' }];
    payload.guestTeams = [{ name: '', noOfPersons: '-1' }] as typeof payload.guestTeams;
    payload.crewMembers = [
      {
        title: '',
        firstName: '',
        lastName: '',
        birthPlace: '',
        birthDate: '',
        documentNumber: '',
        documentExpiryDate: '',
        institution: '',
      },
    ] as typeof payload.crewMembers;
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
  }

  private buildFormBData(except: (keyof FormBPage['sections'])[] = []) {
    const payload = clonePayload(getFormBPayload());

    if (except.includes('membersSection')) {
      payload.guestTeams = [];
      payload.crewMembers = [];
    }

    if (except.includes('additionalPermissionsSection')) {
      payload.permissions = [];
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

    return payload;
  }

  private async setFormBResponse(payload: ReturnType<typeof getFormBPayload>) {
    const url = `${API_URL}/v2/applications/${this.formId}/form-b`;

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
