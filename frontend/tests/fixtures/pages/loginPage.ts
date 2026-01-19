import type { Locator, Page } from '@playwright/test';
import { API_URL } from '@tests/fixtures/consts';

import { getAdminAccountPayload, getAuthDetailsPayload } from '../mockPayloads';

export class LoginPage {
  public readonly page: Page;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitButton: Locator;
  public readonly incorrectEmailOrPasswordMessage: Locator;
  public readonly invalidEmailMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.page.route(`${API_URL}/account`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(getAdminAccountPayload()),
      });
    });

    this.mockLoginResult('success');

    this.emailInput = this.page.getByTestId('login-email-input');
    this.passwordInput = this.page.getByTestId('login-password-input');
    this.submitButton = this.page.getByTestId('login-submit-btn');
    this.incorrectEmailOrPasswordMessage = this.page.getByText('Podano błędne hasło lub użytkownik nie istnieje');
    this.invalidEmailMessage = this.page.getByText('Nieprawidłowy adres email');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async mockLoginResult(result: 'success' | 'failure') {
    if (result === 'success') {
      await this.page.route(`${API_URL}/account/login`, (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(getAuthDetailsPayload()),
          contentType: 'application/json',
        });
      });
    } else {
      await this.page.route(`${API_URL}/account/login`, (route) => {
        route.fulfill({ status: 401 });
      });
    }
  }
}
