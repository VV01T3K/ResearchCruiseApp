import { expect, type Locator, type Page } from '@playwright/test';

export function locateSectionDiv(page: Page, title: string) {
  title = title.replace(/"/g, '\\"'); // escape double quotes
  return page.locator(`main form div:below(:text("${title}"))`).first();
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
      await this.page.getByRole('menuitem', { name: itemText }).click();
      await expect(this.page.getByRole('menuitem')).toHaveCount(0);
    } else if (this.variant === 'menu-with-buttons') {
      await this.page.getByRole('menu').getByRole('button', { name: itemText }).click();
      await expect(this.page.getByRole('menu')).toHaveCount(0);
    } else if (this.variant === 'datetime-picker') {
      // for now, only day selection is supported
      await this.page.getByRole('menu').getByRole('button', { name: itemText }).click();
      await this.page.keyboard.press('Escape'); // to close the datetime picker
      await expect(this.page.getByRole('menu')).toHaveCount(0);
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
