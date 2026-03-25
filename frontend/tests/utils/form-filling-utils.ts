import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Locate a form section by its data-testid attribute.
 * Preferred method over locateSectionDiv.
 */
export function locateSectionByTestId(page: Page, testId: string) {
  return page.getByTestId(testId);
}

type FormDropdownVartiant = 'menuitems' | 'menu-with-buttons' | 'datetime-picker';
export class FormDropdown<TErrors extends Record<string, Locator> = Record<string, Locator>> {
  public readonly page: Page;
  public readonly dropdown: Locator;
  public readonly variant: FormDropdownVartiant;
  public readonly errors: TErrors;

  constructor(dropdown: Locator, options?: { variant?: FormDropdownVartiant; errors?: TErrors }) {
    this.page = dropdown.page();
    this.dropdown = dropdown;
    this.variant = options?.variant ?? 'menuitems';
    this.errors = options?.errors ?? ({} as TErrors);
  }

  async selectOption(itemText: string) {
    await this.dropdown.click();
    if (this.variant === 'menuitems') {
      await this.page.getByRole('option', { name: itemText }).click();
      await expect(this.page.getByRole('option').first())
        .not.toBeVisible({ timeout: 1000 })
        .catch(() => {});
    } else if (this.variant === 'menu-with-buttons') {
      const menu = this.page.getByRole('menu');
      const menuCount = await menu.count();

      if (menuCount > 0) {
        await menu.last().getByRole('button', { name: itemText, exact: true }).click();
      } else {
        const button = this.page
          .getByRole('button', { name: itemText, exact: true })
          .and(this.page.locator(':visible'));
        await button.first().click();
      }
      await this.page.waitForTimeout(100);
    } else if (this.variant === 'datetime-picker') {
      // for now, only day selection is supported
      const menu = this.page.getByRole('menu').last();
      const dayButtons = menu.getByRole('button', { name: itemText, exact: true });
      const dayButtonsCount = await dayButtons.count();

      if (dayButtonsCount === 0) {
        throw new Error(`Could not find datetime-picker day button with text: ${itemText}`);
      }

      let indexToClick = 0;

      if (dayButtonsCount === 2) {
        const dayNumber = parseInt(itemText, 10);
        if (dayNumber > 15) {
          // e.g. 26. First "26" is prev month day, second is current month day
          indexToClick = 1;
        } else {
          // e.g. 2. First "2" is current month day, second is next month day
          indexToClick = 0;
        }
      }

      const dayButton = dayButtons.nth(indexToClick);
      if (await dayButton.isEnabled()) {
        await dayButton.click();
      } else {
        throw new Error(`Could not find enabled datetime-picker day button: ${itemText}`);
      }

      // Click on main content area to close the datetime picker (triggers useOutsideClickDetection)
      await this.page.getByTestId('main-content').click({ position: { x: 1, y: 1 } });
      await expect(menu).toBeHidden();
    }
  }
}

export class FormInput<TErrors extends Record<string, Locator> = Record<string, Locator>> {
  public readonly input: Locator;
  public readonly errors: TErrors;

  constructor(input: Locator, options?: { errors?: TErrors }) {
    this.input = input;
    this.errors = options?.errors ?? ({} as TErrors);
  }

  async fill(value: string) {
    await this.input.fill(value);
  }
}

// for the 'empty' message to appear, the field must be detected as touched,
// so it is filled with some value at first and then cleared
export async function touchInput(input: Locator | FormInput) {
  await input.fill('a');
  await input.fill('');
}
