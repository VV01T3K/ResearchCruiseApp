import type { ParsedLocation } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { expect, it, vi } from 'vite-plus/test';

vi.mock('@/config', () => ({ default: { apiUrl: 'https://api.test' } }));
vi.stubGlobal('window', { location: { origin: 'https://app.test' } });
const { allowOnly, safeRedirect } = await import('@/lib/guards');

const guestRedirect = (href: string) =>
  allowOnly
    .authenticated()({
      context: { queryClient: { query: async () => null } as unknown as QueryClient },
      location: { href } as ParsedLocation<object>,
    })
    .catch((error: { options: { search: object } }) => error.options.search);

it('sends guests to login with the deep link, or plain login for the home page', async () => {
  await expect(guestRedirect('/')).resolves.toEqual({});
  await expect(guestRedirect('/applications?page=2#top')).resolves.toEqual({ redirect: '/applications?page=2#top' });
});

it('follows only same-origin return destinations', () => {
  expect(safeRedirect('/cruises?page=2#top')).toBe('/cruises?page=2#top');
  for (const unsafe of ['https://evil.test', '//evil.test', '/\\evil.test', 'javascript:alert(1)']) {
    expect(safeRedirect(unsafe)).toBeUndefined();
  }
});
