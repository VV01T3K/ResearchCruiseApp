import type { ParsedLocation } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { expect, it, vi } from 'vite-plus/test';

vi.mock('@/config', () => ({ default: { apiUrl: 'https://api.test' } }));
const { allowOnly, redirectSearchSchema } = await import('@/lib/guards');

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

it('accepts only internal app paths as the return destination', () => {
  const parse = (redirect: unknown) => redirectSearchSchema.parse({ redirect }).redirect;
  expect(parse('/cruises?id=1#a')).toBe('/cruises?id=1#a');
  for (const unsafe of ['/', 'https://evil.test', '//evil.test', '/\\evil.test', '/\t/evil.test', 'cruises', 1]) {
    expect(parse(unsafe)).toBeUndefined();
  }
});
