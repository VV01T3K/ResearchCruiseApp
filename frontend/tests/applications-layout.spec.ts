import { expect } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, mockAuthenticatedSession } from './fixtures/mockPayloads';

const statuses = ['draft', 'formBRequired', 'undertaken', 'acceptedBySupervisor'];

// Worst-case rows for width: 100-point badges, both periods and cruise dates, long names and
// the widest status actions.
const applications = Array.from({ length: 100 }, (_, index) => ({
  id: `aaaaaaaa-aaaa-aaaa-aaaa-${String(index).padStart(12, '0')}`,
  number: String(1000 - index),
  year: 2026,
  date: '2026-05-16',
  mainManager: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'manager@example.com',
    firstName: 'Małgorzata',
    lastName: 'Wiśniewska-Kowalczyk',
  },
  deputyManager: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'deputy@example.com',
    firstName: 'Grace',
    lastName: 'Hopper',
  },
  hasFormA: true,
  hasFormB: true,
  hasFormC: false,
  points: 100,
  status: statuses[index % statuses.length],
  effectsDoneRate: '0/3',
  note: 'wersja robocza',
  cruiseHours: '240',
  cruiseDays: 10,
  acceptablePeriodBeg: '2026-06-01',
  acceptablePeriodEnd: '2026-08-31',
  optimalPeriodBeg: '2026-06-15',
  optimalPeriodEnd: '2026-07-31',
  precisePeriodStart: null,
  precisePeriodEnd: null,
  startDate: '2026-06-20T08:00:00Z',
  endDate: '2026-06-30T16:00:00Z',
}));

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test(`applications table fits a ${viewport.width}px laptop viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await mockAuthenticatedSession(page);
    await page.route(`${API_URL}/v2/users/me`, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(getAdminAccountPayload()), contentType: 'application/json' })
    );
    await page.route(`${API_URL}/v2/applications/managers`, (route) => route.fulfill({ json: [] }));
    await page.route(`${API_URL}/v2/applications?*`, (route) =>
      route.fulfill({ json: { items: applications, nextCursor: null } })
    );
    await page.goto('/applications');

    const firstRow = page.locator('tbody tr[data-index="0"]');
    await expect(firstRow).toBeVisible();

    const layout = await page.locator('table').evaluate((table) => {
      const container = table.parentElement!;
      const containerRect = container.getBoundingClientRect();
      const row = table.querySelector('tbody tr[data-index="0"]')!;
      // Counts rendered line boxes of the first text node with exactly this content.
      const lineCount = (text: string) => {
        const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
        let node: Node | null = null;
        while ((node = walker.nextNode())) {
          if (node.parentElement?.textContent?.trim() === text) break;
        }
        if (!node) return -1;
        const range = document.createRange();
        range.selectNodeContents(node.parentElement!);
        return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
      };
      const action = [...row.querySelectorAll('a')].find((link) => link.textContent?.includes('Szczegóły'))!;
      return {
        overflow: container.scrollWidth - container.clientWidth,
        badgeLines: lineCount('100 pkt.'),
        dateLines: lineCount('2026-05-16'),
        actionRight: action.getBoundingClientRect().right,
        avatarAspect: (() => {
          const avatar = row.querySelector('.rounded-full')!.getBoundingClientRect();
          return avatar.width / avatar.height;
        })(),
        containerRight: containerRect.right,
        rowsRendered: table.querySelectorAll('tbody tr[data-index]').length,
      };
    });

    expect(layout.badgeLines, '"100 pkt." stays on one line').toBe(1);
    expect(layout.dateLines, 'the application date stays on one line').toBe(1);
    expect(layout.avatarAspect, 'the manager avatar is not squeezed').toBeCloseTo(1, 1);
    expect(layout.overflow, 'the table needs no horizontal scrolling').toBeLessThanOrEqual(0);
    expect(layout.actionRight, 'row actions are visible next to the application number').toBeLessThanOrEqual(
      layout.containerRight + 0.5
    );
    // Virtualization still renders a window of rows, not all 100.
    expect(layout.rowsRendered).toBeGreaterThan(0);
    expect(layout.rowsRendered).toBeLessThan(100);
  });
}
