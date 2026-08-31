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
    await this.dropdown.evaluate((element) => element.scrollIntoView({ block: 'center' }));

    if (this.variant === 'datetime-picker') {
      // A real click gets lost on a freshly added row: mousedown focuses the button, that
      // re-renders the row, the button shifts out from under the cursor, and mouseup lands on
      // the surrounding <td>. The browser then fires click on the common ancestor, so the
      // button's own onClick never runs and the calendar never opens. Dispatching the event
      // directly is coordinate-independent and immune to the shift. The app itself is fine --
      // by the time a person aims at the field the layout has already settled.
      await this.dropdown.dispatchEvent('click');
    } else {
      await this.dropdown.click();
    }
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
        if ((await button.count()) === 0) await this.dropdown.click();
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
      } else if (dayButtonsCount > 2) {
        throw new Error(`Unexpected number of datetime-picker day buttons (${dayButtonsCount}) for day: ${itemText}`);
      }

      const dayButton = dayButtons.nth(indexToClick);
      if (!(await dayButton.isEnabled())) {
        throw new Error(`Could not find enabled datetime-picker day button: ${itemText}`);
      }
      // Dispatched for the same reason as the button above: selecting a day re-renders the
      // calendar, so a coordinate-based click can land on whatever slides under the cursor.
      await dayButton.dispatchEvent('click');

      // A 'date' picker closes itself on selection, but a 'datetime' one stays open for the
      // time input, so it has to be dismissed. useOutsideClickDetection listens for mousedown
      // on document and closes when the target sits outside the input and the calendar, so
      // dispatching on <body> is enough. Clicking a fixed point instead is unreliable: the
      // calendar is `fixed z-50` and, once the form is tall enough, covers it. Escape is
      // handled by the hook but does not close this picker.
      await this.page.evaluate(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
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

  /**
   * Fills the input and blurs it.
   *
   * The form fields wire `onChange={field.setValue}`, which updates the value without
   * triggering change-validation, so `field.state.meta.errors` — and therefore the rendered
   * error message — only recomputes on blur. Filling without blurring leaves a stale error
   * on screen even though the value is already correct.
   */
  async fill(value: string) {
    await this.input.fill(value);
    await this.input.blur();
  }
}

// for the 'empty' message to appear, the field must be detected as touched,
// so it is filled with some value at first and then cleared
export async function touchInput(input: Locator | FormInput) {
  await input.fill('a');
  await input.fill('');
  await (input instanceof FormInput ? input.input : input).blur();
}
