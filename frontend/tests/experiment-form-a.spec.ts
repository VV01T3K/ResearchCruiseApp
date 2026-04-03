import { expect, type Locator, type Page } from '@playwright/test';

import { test } from './fixtures/fixtures';
import { FormDropdown } from './utils/form-filling-utils';

test.describe('experimental form A', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experiments/form-a');
  });

  test('happy path renders the live payload inline', async ({ page }) => {
    await fillHappyPath(page);

    const liveValuesPanel = page.getByTestId('experiment-form-a-live-values');
    await expect(liveValuesPanel).toBeVisible();
    await expect(liveValuesPanel).toContainText('"periodSelectionType": "period"');
    await expect(liveValuesPanel).toContainText('"shipUsage": "0"');
    await expect(liveValuesPanel).toContainText('"cruiseGoal": "0"');
  });

  test('deputy cannot match the selected manager', async ({ page }) => {
    const section = page.getByTestId('experiment-form-a-section-1');
    await selectOption(section, 'Kierownik rejsu', 'Kierownik Kierowniczy (kierownik@o2.com)');
    await selectOption(section, 'Zastępca kierownika rejsu', 'Kierownik Kierowniczy (kierownik@o2.com)');

    await fillSectionTwoAndFive(page);
    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();

    await expect(
      section.getByText('Kierownik rejsu nie może być jednocześnie zastępcą kierownika rejsu')
    ).toBeVisible();
  });

  test('precise mode requires both dates and rejects an end before the start', async ({ page }) => {
    const section = page.getByTestId('experiment-form-a-section-2');

    await fillSectionOne(page);
    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Dokładny termin');
    await fillSectionTwoAndFive(page, { preciseMode: true, skipPreciseDates: true });

    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();
    await expect(section.getByText('Dokładny termin rozpoczęcia rejsu jest wymagany')).toBeVisible();
    await expect(section.getByText('Dokładny termin zakończenia rejsu jest wymagany')).toBeVisible();

    await page.getByTestId('experiment-form-a-precise-start').fill('2025-09-20');
    await page.getByTestId('experiment-form-a-precise-end').fill('2025-09-10');
    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();

    await expect(section.getByText('Data zakończenia musi być późniejsza niż data rozpoczęcia')).toBeVisible();
  });

  test('period mode keeps the optimal range constrained to the acceptable bounds', async ({ page }) => {
    const section = page.getByTestId('experiment-form-a-section-2');

    await fillHappyPath(page);

    const sliders = section.getByRole('slider');
    await sliders.nth(0).focus();
    await pressArrow(page, 'ArrowRight', 8);
    await sliders.nth(1).focus();
    await pressArrow(page, 'ArrowLeft', 16);

    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();

    const liveValuesPanel = page.getByTestId('experiment-form-a-live-values');
    await expect(liveValuesPanel).toContainText('"acceptablePeriod": [');
    await expect(liveValuesPanel).toContainText('"8"');
    await expect(liveValuesPanel).toContainText('"9"');
  });

  test('changing cruise duration can invalidate a too-short period range', async ({ page }) => {
    const section = page.getByTestId('experiment-form-a-section-2');

    await fillHappyPath(page);

    const sliders = section.getByRole('slider');
    await sliders.nth(0).focus();
    await pressArrow(page, 'ArrowRight', 11);
    await sliders.nth(1).focus();
    await pressArrow(page, 'ArrowLeft', 12);
    await sliders.nth(2).focus();
    await pressArrow(page, 'ArrowLeft', 2);
    await sliders.nth(3).focus();
    await pressArrow(page, 'ArrowLeft', 4);

    await page.getByTestId('experiment-form-a-days-input').fill('30');
    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();

    await expect(
      section.getByText('Wybrany okres czasu jest zbyt krótki dla planowanego czasu rejsu').first()
    ).toBeVisible();
  });

  test('ship usage "inne" requires additional details', async ({ page }) => {
    const section = page.getByTestId('experiment-form-a-section-2');

    await fillSectionOne(page);
    await fillSectionTwoAndFive(page, { shipUsage: 'w inny sposób', skipDifferentUsage: true });
    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();

    await expect(
      section.getByText('W przypadku wyboru "inne" należy podać informacje o sposobie korzystania ze statku')
    ).toBeVisible();
  });

  test('choosing a cruise goal requires a description', async ({ page }) => {
    const section = page.getByTestId('experiment-form-a-section-5');

    await fillSectionOne(page);
    await fillSectionTwo(page);
    await selectOption(section, 'Cel rejsu', 'Naukowy');
    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();

    await expect(section.getByText('Opis celu rejsu jest wymagany')).toBeVisible();
  });

  test('blocked precise ranges surface a warning and fail validation when no slot can fit the cruise', async ({
    page,
  }) => {
    const sectionOne = page.getByTestId('experiment-form-a-section-1');
    const sectionTwo = page.getByTestId('experiment-form-a-section-2');

    await selectOption(sectionOne, 'Kierownik rejsu', 'Kierownik Kierowniczy (kierownik@o2.com)');
    await selectOption(sectionOne, 'Zastępca kierownika rejsu', 'Admin Adminowy (admin@gmail.com)');
    await selectOption(sectionOne, 'Rok', '2026');

    await selectOption(sectionTwo, 'Wybierz sposób określenia terminu rejsu', 'Dokładny termin');
    await page.getByTestId('experiment-form-a-precise-start').fill('2026-02-01');
    await page.getByTestId('experiment-form-a-precise-end').fill('2026-02-10');
    await page.getByTestId('experiment-form-a-hours-input').fill('240');
    await selectOption(sectionTwo, 'Statek na potrzeby badań będzie wykorzystywany', 'całą dobę');
    await page.getByLabel('Uwagi dotyczące terminu').fill('Sprawdzam obsługę lokalnych blokad.');

    const sectionFive = page.getByTestId('experiment-form-a-section-5');
    await selectOption(sectionFive, 'Cel rejsu', 'Naukowy');
    await page.getByLabel('Opis celu rejsu').fill('Cel badawczy pomimo zablokowanego okna.');

    await expect(page.getByTestId('experiment-form-a-blockade-overlap')).toBeVisible();
    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();

    await expect(
      sectionTwo.getByText(
        'Rejs nie może się odbyć w podanym terminie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.'
      )
    ).toBeVisible();
  });

  test('precise dates stay preserved when switching modes in live values', async ({ page }) => {
    const section = page.getByTestId('experiment-form-a-section-2');

    await fillSectionOne(page);
    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Dokładny termin');
    await page.getByTestId('experiment-form-a-precise-start').fill('2025-09-05');
    await page.getByTestId('experiment-form-a-precise-end').fill('2025-09-12');

    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Okres dopuszczalny/optymalny');
    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Dokładny termin');

    await expect(page.getByTestId('experiment-form-a-precise-start')).toHaveValue('2025-09-05');
    await expect(page.getByTestId('experiment-form-a-precise-end')).toHaveValue('2025-09-12');

    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Okres dopuszczalny/optymalny');
    const liveValuesPanel = page.getByTestId('experiment-form-a-live-values');
    await expect(liveValuesPanel).toContainText('"precisePeriodStart": "2025-09-05"');
    await expect(liveValuesPanel).toContainText('"precisePeriodEnd": "2025-09-12"');
  });

  test('hiding an invalid precise branch clears visible errors and preserved ship details stay in live values', async ({
    page,
  }) => {
    const section = page.getByTestId('experiment-form-a-section-2');

    await fillSectionOne(page);
    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Dokładny termin');
    await page.getByTestId('experiment-form-a-days-input').fill('6');
    await selectOption(section, 'Statek na potrzeby badań będzie wykorzystywany', 'w inny sposób');
    await page.getByLabel('Inny sposób użycia').fill('Zachowaj te dane po ukryciu pola.');
    await fillSectionFive(page);

    await page.getByRole('button', { name: 'Zapisz eksperyment' }).click();
    await expect(section.getByText('Dokładny termin rozpoczęcia rejsu jest wymagany')).toBeVisible();
    await expect(section.getByText('Dokładny termin zakończenia rejsu jest wymagany')).toBeVisible();

    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Okres dopuszczalny/optymalny');
    await expect(section.getByText('Dokładny termin rozpoczęcia rejsu jest wymagany')).toBeHidden();
    await expect(section.getByText('Dokładny termin zakończenia rejsu jest wymagany')).toBeHidden();

    await selectOption(section, 'Statek na potrzeby badań będzie wykorzystywany', 'całą dobę');
    await selectOption(section, 'Statek na potrzeby badań będzie wykorzystywany', 'w inny sposób');
    await expect(page.getByLabel('Inny sposób użycia')).toHaveValue('Zachowaj te dane po ukryciu pola.');

    await selectOption(section, 'Statek na potrzeby badań będzie wykorzystywany', 'całą dobę');
    const liveValuesPanel = page.getByTestId('experiment-form-a-live-values');
    await expect(liveValuesPanel).toContainText('"differentUsage": "Zachowaj te dane po ukryciu pola."');
  });
});

async function fillHappyPath(page: Page) {
  await fillSectionOne(page);
  await fillSectionTwo(page);
  await fillSectionFive(page);
}

async function fillSectionOne(page: Page) {
  const section = page.getByTestId('experiment-form-a-section-1');
  await selectOption(section, 'Kierownik rejsu', 'Kierownik Kierowniczy (kierownik@o2.com)');
  await selectOption(section, 'Zastępca kierownika rejsu', 'Admin Adminowy (admin@gmail.com)');
}

async function fillSectionTwoAndFive(
  page: Page,
  options?: {
    preciseMode?: boolean;
    skipPreciseDates?: boolean;
    shipUsage?: string;
    skipDifferentUsage?: boolean;
  }
) {
  await fillSectionTwo(page, options);
  await fillSectionFive(page);
}

async function fillSectionTwo(
  page: Page,
  options?: {
    preciseMode?: boolean;
    skipPreciseDates?: boolean;
    shipUsage?: string;
    skipDifferentUsage?: boolean;
  }
) {
  const section = page.getByTestId('experiment-form-a-section-2');

  if (options?.preciseMode) {
    await selectOption(section, 'Wybierz sposób określenia terminu rejsu', 'Dokładny termin');
    if (!options.skipPreciseDates) {
      await page.getByTestId('experiment-form-a-precise-start').fill('2025-09-05');
      await page.getByTestId('experiment-form-a-precise-end').fill('2025-09-12');
    }
  }

  await page.getByTestId('experiment-form-a-days-input').fill('6');
  await page.getByLabel('Uwagi dotyczące terminu').fill('Eksperymentalny termin rejsu na potrzeby prototypu.');

  const shipUsageLabel = options?.shipUsage ?? 'całą dobę';
  await selectOption(section, 'Statek na potrzeby badań będzie wykorzystywany', shipUsageLabel);

  if (shipUsageLabel === 'w inny sposób' && !options?.skipDifferentUsage) {
    await page
      .getByLabel('Inny sposób użycia')
      .fill('Statek będzie wspierał badania tylko przy wybranych oknach pogodowych.');
  }
}

async function fillSectionFive(page: Page) {
  const section = page.getByTestId('experiment-form-a-section-5');
  await selectOption(section, 'Cel rejsu', 'Naukowy');
  await page.getByLabel('Opis celu rejsu').fill('Rejs ma charakter badawczy i waliduje nowy model formularza.');
}

function getSelectTrigger(section: Locator, label: string): Locator {
  return section.getByRole('combobox', { name: label });
}

async function selectOption(section: Locator, label: string, optionText: string) {
  await new FormDropdown(getSelectTrigger(section, label)).selectOption(optionText);
}

async function pressArrow(page: Page, key: 'ArrowLeft' | 'ArrowRight', count: number) {
  for (let index = 0; index < count; index += 1) {
    await page.keyboard.press(key);
  }
}
