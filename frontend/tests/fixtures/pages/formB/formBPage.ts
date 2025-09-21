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

import { FormBAdditionalPermissionsSection } from './FormBAdditionalPermissionsSection';
import { FormBContractsSection } from './FormBContractsSection';
import { FormBCruiseDayDetailsSection } from './FormBCruiseDayDetailsSection';
import { FormBCruiseDetailsSection } from './FormBCruiseDetailsSection';
import { FormBCruiseGoalSection } from './FormBCruiseGoalSection';
import { FormBCruiseInfoSection } from './FormBCruiseInfoSection';
import { FormBCruiseManagerInfoSection } from './FormBCruiseManagerInfoSection';
import { FormBMembersSection } from './FormBMembersSection';
import { FormBPublicationsSection } from './FormBPublicationsSection';
import { FormBResearchAreaSection } from './FormBResearchAreaSection';
import { FormBResearchEquipmentsSection } from './FormBResearchEquipmentsSection';
import { FormBResearchTasksSection } from './FormBResearchTasksSection';
import { FormBShipEquipmentsSection } from './FormBShipEquipmentsSection';
import { FormBShipUsageSection } from './FormBShipUsageSection';
import { FormBSPUBTasksSection } from './FormBSPUBTasksSection';

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

    // Form B is not yet created, so we mock a 404 response
    page.route(`${API_URL}/api/CruiseApplications/${formId}/formB`, (route) => {
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

    page.route(`${API_URL}/api/CruiseApplications/${formId}/FormB?isDraft=false`, (route) => {
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
      cruiseInfoSection: new FormBCruiseInfoSection(this),
      cruiseManagerInfoSection: new FormBCruiseManagerInfoSection(this),
      shipUsageSection: new FormBShipUsageSection(this),
      additionalPermissionsSection: new FormBAdditionalPermissionsSection(this),
      researchAreaSection: new FormBResearchAreaSection(this),
      cruiseGoalSection: new FormBCruiseGoalSection(this),
      researchTasksSection: new FormBResearchTasksSection(this),
      contractsSection: new FormBContractsSection(this),
      membersSection: new FormBMembersSection(this),
      publicationsSection: new FormBPublicationsSection(this),
      SPUBTasksSection: new FormBSPUBTasksSection(this),
      cruiseDetailsSection: new FormBCruiseDetailsSection(this),
      cruiseDayDetailsSection: new FormBCruiseDayDetailsSection(this),
      researchEquipmentsSection: new FormBResearchEquipmentsSection(this),
      shipEquipmentSection: new FormBShipEquipmentsSection(this),
    } as const;

    this.submitButton = this.page.getByRole('button', { name: 'Wyślij' });
    this.toastMessage = this.page.locator('#_rht_toaster');
    this.submissionApprovedMessage = this.toastMessage.getByText('Formularz został wysłany pomyślnie.');
    this.validationErrorMessage = this.toastMessage.getByText(
      'Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.'
    );
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
