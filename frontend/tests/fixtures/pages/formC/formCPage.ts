import { expect, type Locator, type Page } from '@playwright/test';
import { API_URL, TESTED_FORM_ID } from '@tests/fixtures/consts';
import {
  getAdminAccountPayload,
  getAuthDetailsPayload,
  getCruisePayload,
  getFormAPayload,
  getFormBPayload,
  getInitValuesAPayload,
  getInitValuesBPayload,
} from '@tests/fixtures/mockPayloads';

import { FormCAdditionalDescriptionSection } from './FormCAdditionalDescriptionSection';
import { FormCAdditionalPermissionsSection } from './FormCAdditionalPermissionsSection';
import { FormCCollectedSamplesSection } from './FormCCollectedSamplesSection';
import { FormCContractsSection } from './FormCContractsSection';
import { FormCCruiseDayDetailsSection } from './FormCCruiseDayDetailsSection';
import { FormCCruiseDetailsSection } from './FormCCruiseDetailsSection';
import { FormCCruiseGoalSection } from './FormCCruiseGoalSection';
import { FormCCruiseInfoSection } from './FormCCruiseInfoSection';
import { FormCCruiseManagerInfoSection } from './FormCCruiseManagerInfoSection';
import { FormCMembersSection } from './FormCMembersSection';
import { FormCPublicationsSection } from './FormCPublicationsSection';
import { FormCResearchAreaSection } from './FormCResearchAreaSection';
import { FormCResearchEquipmentsSection } from './FormCResearchEquipmentsSection';
import { FormCResearchTasksSection } from './FormCResearchTasksSection';
import { FormCShipEquipmentsSection } from './FormCShipEquipmentsSection';
import { FormCShipUsageSection } from './FormCShipUsageSection';
import { FormCSPUBReportDataSection } from './FormCSPUBReportDataSection';
import { FormCSPUBTasksSection } from './FormCSPUBTasksSection';

export class FormCPage {
  public readonly page: Page;
  public readonly formId: string;
  public readonly sections;
  public readonly submitButton: Locator;
  private readonly toastMessage: Locator;
  public readonly submissionApprovedMessage: Locator;
  public readonly validationErrorMessage: Locator;

  public static async create(page: Page, formId: string = TESTED_FORM_ID): Promise<FormCPage> {
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

    page.route(`${API_URL}/api/CruiseApplications/${formId}/cruise`, (route) => {
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

    page.route(`${API_URL}/api/CruiseApplications/${formId}/formB`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getFormBPayload()),
      });
    });

    // Form C is not yet created, so we mock a 404 response
    page.route(`${API_URL}/api/CruiseApplications/${formId}/formC`, (route) => {
      route.fulfill({
        status: 404,
      });
    });

    page.route(`${API_URL}/account`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getAdminAccountPayload()),
      });
    });

    page.route(`${API_URL}/api/CruiseApplications/${formId}/FormC?isDraft=false`, (route) => {
      route.fulfill({
        status: 200,
      });
    });

    // return empty list of applications
    page.route(`${API_URL}/api/CruiseApplications`, (route) => {
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

    const formBPage = new FormCPage(page, formId);
    await formBPage.goto();
    return formBPage;
  }

  public async goto(mode: 'edit' | 'view' | null = 'edit') {
    const modeParam = mode === null ? '' : `?mode=${mode}`;
    await this.page.goto(`/applications/${this.formId}/formC${modeParam}`);
  }

  private constructor(page: Page, formId: string) {
    this.page = page;
    this.formId = formId;
    this.sections = {
      cruiseInfoSection: new FormCCruiseInfoSection(this),
      cruiseManagerInfoSection: new FormCCruiseManagerInfoSection(this),
      shipUsageSection: new FormCShipUsageSection(this),
      additionalPermissionsSection: new FormCAdditionalPermissionsSection(this),
      researchAreaSection: new FormCResearchAreaSection(this),
      cruiseGoalSection: new FormCCruiseGoalSection(this),
      researchTasksSection: new FormCResearchTasksSection(this),
      contractsSection: new FormCContractsSection(this),
      membersSection: new FormCMembersSection(this),
      publicationsSection: new FormCPublicationsSection(this),
      spubTasksSection: new FormCSPUBTasksSection(this),
      cruiseDetailsSection: new FormCCruiseDetailsSection(this),
      cruiseDayDetailsSection: new FormCCruiseDayDetailsSection(this),
      researchEquipmentsSection: new FormCResearchEquipmentsSection(this),
      shipEquipmentsSection: new FormCShipEquipmentsSection(this),
      collectedSamplesSection: new FormCCollectedSamplesSection(this),
      spubReportDataSection: new FormCSPUBReportDataSection(this),
      additionalDescriptionSection: new FormCAdditionalDescriptionSection(this),
    } as const;

    this.submitButton = this.page.getByRole('button', { name: 'Wyślij' });
    this.toastMessage = this.page.locator('#_rht_toaster');
    this.submissionApprovedMessage = this.toastMessage.getByText('Formularz został wysłany pomyślnie.');
    this.validationErrorMessage = this.toastMessage.getByText(
      'Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.'
    );
  }

  public async fillForm({ except }: { except?: (keyof FormCPage['sections'])[] } = {}) {
    except ??= [];
    const sections = Object.entries(this.sections);
    for (const [key, section] of sections) {
      if (except.includes(key as keyof FormCPage['sections'])) {
        continue;
      }
      await section.defaultFill();
    }
  }

  public async submitForm({ expectedResult }: { expectedResult?: 'valid' | 'invalid' } = {}) {
    await this.submitButton.click();

    switch (expectedResult) {
      case 'valid':
        await expect(this.submissionApprovedMessage).toBeVisible();
        break;
      case 'invalid':
        await expect(this.validationErrorMessage).toBeVisible();
        await this.toastMessage.getByRole('button').click();
        break;
    }
  }
}
