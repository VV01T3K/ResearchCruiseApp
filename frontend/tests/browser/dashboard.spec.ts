import { test, expect, applicationForms } from './fixtures';
import { admin } from '../data/accounts';

const phone = { width: 390, height: 844 };
test.use({ account: admin, viewport: phone, screen: phone, isMobile: true, hasTouch: true });

test('a phone gets a device-width two-column dashboard and the 1024 px layout elsewhere', async ({ page, network }) => {
  network.use(...applicationForms());
  const viewport = page.locator('meta[name="viewport"]');
  await page.goto('/');
  await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  const cards = page.getByRole('main').getByRole('link');
  const left = (i: number) => cards.nth(i).evaluate((card) => card.getBoundingClientRect().left);
  expect(await left(2)).toBeGreaterThan(await left(1));
  expect(await left(3)).toBe(await left(1));

  await page.getByRole('link', { name: 'Zgłoszenia', exact: true }).click();
  await expect(page).toHaveURL('/applications');
  await expect(viewport).toHaveAttribute('content', 'width=1024');
});
